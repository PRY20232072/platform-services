const { createHash } = require('crypto')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')
const { get } = require('http')
const { Constants } = require('./Constants');

class CommonClient {
    constructor(TP_NAME, TP_CODE, TP_VERSION) { 
        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();

        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();

        this.TP_NAME = TP_NAME;
        this.TP_CODE = TP_CODE;
        this.TP_VERSION = TP_VERSION;

        // console.log("CommonClient | TP_NAME: " + this.TP_NAME);
        // console.log("CommonClient | TP_CODE: " + this.TP_CODE);
    }

    hash(identifier) {
        return createHash('sha512').update(identifier).digest('hex');
    }

    getAddress(address) {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        var addr = this.hash(address).substring(0, 62);
        return pref + this.TP_CODE + addr;
    }

    getAddressList() {
        var pref = this.hash(this.TP_NAME).substring(0, 6);
        return pref + this.TP_CODE;
    }

    wrap_and_send(identifier, payload) {
        var enc = new TextEncoder('utf8');
        var payloadBytes = enc.encode(payload);

        var txnHeaderBytes = this.make_txn_header_bytes(identifier, payloadBytes);
        var txnBytes = this.make_txn_bytes(txnHeaderBytes, payloadBytes);

        return this.send_request('/batches', txnBytes);
    }

    make_txn_header_bytes(identifier, payloadBytes) {
        var address = this.getAddress(identifier);

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

    send_request(suffix, data) {
        const URL = Constants.SAWTOOTH_REST_API_URL + suffix;
        if (data === null) {
            return fetch(URL, {
                    method: 'GET'
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    var data = responseJson.data;

                    //validate if the response is array or object
                    if (data instanceof Array) {
                        var response = [];
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var decoded = this.base64_decode(item.data);
                            response.push(JSON.parse(decoded));
                        }
                        return response;
                    }
                    else {
                        var decoded = this.base64_decode(data);
                        return JSON.parse(decoded);
                    }
                });
        }
        else {
            return fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    },
                    body: data
                })
                .then((response) => response.json())
                .then((responseJson) => {

                    return responseJson;
                });
        }
    }
}

module.exports.CommonClient = CommonClient;