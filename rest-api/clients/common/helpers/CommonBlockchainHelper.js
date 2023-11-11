const { CryptoFactory, createContext } = require('sawtooth-sdk/signing');
const protobuf = require('sawtooth-sdk/protobuf');
const { InfuraIPFSClient } = require('../InfuraIPFSClient');
const axios = require('axios');
const { Constants } = require('../Constants');
const { CommonAddressHelper } = require('./CommonAddressHelper');

class CommonBlockchainHelper {
    constructor(TP_NAME, TP_CODE, TP_VERSION) { 
        this.infuraIPFSClient = new InfuraIPFSClient();
        this.CommonAddressHelper = new CommonAddressHelper(TP_NAME, TP_CODE, TP_VERSION);

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

    make_txn_header_bytes(payloadBytes, address) {
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: this.TP_NAME,
            familyVersion: this.TP_VERSION,
            inputs: address,
            outputs: address,
            signerPublicKey: this.signer.getPublicKey().asHex(),
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: this.CommonAddressHelper.hash(payloadBytes),
            nonce: "" + Math.random(),
            payloadBytesSha512: this.CommonAddressHelper.hash(payloadBytes)
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

    async getRegistry(address) {
        var data = await this.fetchFromBlockchain('/state/' + address);
        return data;
    }

    async getRegistryList(address) {
        var data = await this.fetchFromBlockchain('/state?address=' + address);
        return data;
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
}

module.exports.CommonBlockchainHelper = CommonBlockchainHelper;