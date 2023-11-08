const { createHash } = require('crypto')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { Constants } = require('./Constants');
const { InfuraIPFSClient } = require('./InfuraIPFSClient');
const axios = require('axios');

class CommonClient {
    constructor(TP_NAME, TP_CODE, TP_VERSION) { 
        this.infuraIPFSClient = new InfuraIPFSClient();

        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();

        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();

        this.TP_NAME = TP_NAME;
        this.TP_CODE = TP_CODE;
        this.TP_VERSION = TP_VERSION;

        this.blockchainClient = axios.create({
            baseURL: Constants.SAWTOOTH_REST_API_URL,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            }
        });
    }

    //HELPER FUNCTIONS
    hash(identifier) {
        return createHash('sha512').update(identifier).digest('hex');
    }
    
    getAddressList() {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        return pref + this.TP_CODE;
    }
    
    async getRegistry(address) {
        var data = await this.fetchFromBlockchain('/state/' + address);
        return data;
    }

    async getRegistryList(address) {
        var data = await this.fetchFromBlockchain('/state?address=' + address);
        return data;
    }
    
    make_txn_header_bytes(payloadBytes, address) {
        // var address = this.getAddress(identifier);

        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: this.TP_NAME,
            familyVersion: this.TP_VERSION,
            inputs: [address],
            outputs: [address],
            signerPublicKey: this.signer.getPublicKey().asHex(),
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: this.hash(payloadBytes),
            nonce: "" + Math.random(),
            payloadBytesSha512: this.hash(payloadBytes)
        }).finish();

        return transactionHeaderBytes;
    }

    make_txn_bytes(txnHeaderBytes, payloadBytes) {
        const signature = this.signer.sign(txnHeaderBytes);

        const transaction = protobuf.Transaction.create({
            header: txnHeaderBytes,
            headerSignature: signature,
            payload: payloadBytes
        });

        const transactions = [transaction];

        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();

        const batchSignature = this.signer.sign(batchHeaderBytes);

        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions
        });

        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();

        return batchListBytes;
    }

    base64_decode(encoded) {
        return Buffer.from(encoded, 'base64').toString();
    }

    async fetchFromBlockchain(suffix) {
        const URL = Constants.SAWTOOTH_REST_API_URL + suffix;
        var res = await this.blockchainClient.get(URL)
            .then((response) => {
                var data = response.data.data;

                var res = {
                    error: false,
                    data: null
                };
                if (data instanceof Array) {
                    res.data = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var decoded = this.base64_decode(item.data);
                        res.data.push(JSON.parse(decoded));
                    }
                }
                else {
                    var decoded = this.base64_decode(data);
                    res.data = JSON.parse(decoded);
                }

                return res;
            })
            .catch((error) => {
                console.error(error);
                var res = {
                    error: true,
                    data: null
                };
                return res;
            });
        return res;
    }

    async saveDataInBlockchain(suffix, data) {
        const URL = Constants.SAWTOOTH_REST_API_URL + suffix;
        var response = {
            error: true,
            data: null
        };

        await this.blockchainClient.post(URL, data, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            })
            .then((res) => {
                response.data = res.data;
                response.error = false;
            })
            .catch((error) => {
                console.error(error)
            });

        return response;
    }

    async get_from_ipfs(ipfs_hash) {
        var response  = await this.infuraIPFSClient.cat(ipfs_hash);
        return response;
    }
    // END OF HELPER FUNCTIONS

    async getByIdentifier(address) {
        var registry = await this.getRegistry(address);

        if (registry.error) {
            return registry;
        }

        registry = registry.data;
        var info = await this.get_from_ipfs(registry.ipfs_hash);

        if (info.error) {
            return info;
        }

        return info;
    }

    async getList(address) {
        var response = {
            error: true,
            data: null
        }

        var registries = await this.getRegistryList(address);

        if (registries.error) {
            return registries;
        }

        var allergyList = [];
        registries = registries.data;
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            var info = await this.get_from_ipfs(registry.ipfs_hash);
            if (info.error) {
                return response;
            }
            allergyList.push(info.data);
        }
        response.error = false;
        response.data = allergyList;

        return allergyList;
    }
}

module.exports.CommonClient = CommonClient;