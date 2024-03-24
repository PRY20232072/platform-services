const { CryptoFactory, createContext } = require('sawtooth-sdk/signing');
const protobuf = require('sawtooth-sdk/protobuf');
const axios = require('axios');
const { Constants } = require('../Constants');
const { CommonAddressHelper } = require('./CommonAddressHelper');
const { ResponseObject } = require('../ResponseObject');
const { CustomError } = require('../errors/CustomError');

class CommonBlockchainHelper {
    constructor(TP_NAME, TP_CODE, TP_VERSION) {
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

    async getRegistry(address) {
        try {
            var data = await this.fetchFromBlockchain('/state/' + address);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getRegistryList(address) {
        try {
            var data = await this.fetchFromBlockchain('/state?address=' + address);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async fetchFromBlockchain(suffix) {
        try {
            const URL = Constants.SAWTOOTH_REST_API_URL + suffix;

            var response = await this.blockchainClient.get(URL);

            var data = response.data.data;
            var responseData = undefined;

            if (data instanceof Array) {
                responseData = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var decoded = this.base64_decode(item.data);
                    responseData.push(JSON.parse(decoded));
                }
            }
            else {
                var decoded = this.base64_decode(data);
                responseData = JSON.parse(decoded);
            }

            return new ResponseObject(responseData);
        } catch (error) {
            throw new CustomError(
                Constants.ERROR_FETCHING_FROM_BLOCKCHAIN,
                error.message,
            );
        }
    }

    async wrap_and_send(payload, address) {
        try {
            var enc = new TextEncoder('utf8');

            payload = JSON.stringify(payload);

            var payloadBytes = enc.encode(payload);

            var txnHeaderBytes = this.make_txn_header_bytes(payloadBytes, address);
            var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

            var response = await this.saveDataInBlockchain('/batches', txnBytes);

            //TODO: validate if response has info

            return response;
        } catch (error) {
            throw error;
        }
    }

    async saveDataInBlockchain(suffix, data) {
        try {
            const URL = Constants.SAWTOOTH_REST_API_URL + suffix;

            var response = await this.blockchainClient.post(URL, data, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            return new ResponseObject(response.data);
        } catch (error) {
            console.error(error)
            throw new CustomError(
                Constants.ERROR_SAVING_TO_BLOCKCHAIN,
                error.message,
            );
        }
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
}

module.exports.CommonBlockchainHelper = CommonBlockchainHelper;