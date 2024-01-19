require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const axios = require('axios');

class PinataIPFSClient {
    constructor() {
        if (PinataIPFSClient.instance) {
            return PinataIPFSClient.instance;
        }

        this.instance = new pinataSDK({
            pinataJWTKey: process.env.PINATA_JWT_KEY,
        })
        this.gatewayInstance = axios.create({
            baseURL: process.env.PINATA_GATEWAY_URL,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,DELETE'
            }
        });

        PinataIPFSClient.instance = this;
    }

    async add(data) {
        var response = {
            hash: '',
            error: true
        };
        await this.instance.pinJSONToIPFS(data).then((res) => {
            response.hash = res.IpfsHash;
            response.error = false;
        }).catch((error) => {
            console.error(error);
        });
        return response;
    }

    async cat(hash) {
        var response = {
            data: '',
            error: true
        };
        await this.gatewayInstance.get(`${hash}`).then((res) => {
            response.data = res.data;
            response.error = false;
        }).catch((error) => {
            console.error(error);
        });
        return response;
    }

    async rm(hast) {
        var response = {
            data: '',
            error: true
        };
        await this.instance.unpin(hast).then((res) => {
            response.data = res;
            response.error = false;
        }).catch((error) => {
            console.error(error);
        });
        return response;
    }
}

module.exports.PinataIPFSClient = PinataIPFSClient;