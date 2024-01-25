require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const { ResponseObject } = require('../ResponseObject');
const { Constants } = require('../Constants');

class PinataIPFSClient {
    constructor() {
        if (PinataIPFSClient.instance) {
            return PinataIPFSClient.instance;
        }

        this.instance = new pinataSDK({
            pinataJWTKey: Constants.IPFS_PINATA_JWT_KEY,
        })
        this.gatewayInstance = axios.create({
            baseURL: Constants.IPFS_PINATA_GATEWAY_URL,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,DELETE'
            }
        });

        PinataIPFSClient.instance = this;
    }

    /**
     * Adds data to IPFS by pinning it as a JSON object.
     * @param {Object} data - The data to be pinned to IPFS.
     * @returns {Object} - An object containing the pinned data and an error flag.
     */
    async add(data) {
        try {
            const res = await this.instance.pinJSONToIPFS(data);
            return new ResponseObject(res.IpfsHash);
        } catch (error) {
            console.log(error);
            return new ResponseObject('', true);
        }
    }

    /**
     * Retrieves the data associated with a given IPFS hash.
     * @param {string} hash - The IPFS hash to retrieve data from.
     * @returns {Promise<{ data: any, error: boolean }>} - The retrieved data and an error flag indicating if an error occurred.
     */
    async cat(hash) {
        try {
            const res = await this.gatewayInstance.get(`${hash}`);
            return new ResponseObject(res.data);
        } catch (error) {
            console.log(error);
            return new ResponseObject('', true);
        }
    }

    /**
     * Removes a file from IPFS by unpinning it.
     * @param {string} hast - The hash of the file to be removed.
     * @returns {Promise<{ data: any, error: boolean }>} - The result of the removal operation, including the data and error status.
     */
    async rm(hast) {
        try {
            const res = await this.instance.unpin(hast);
            return new ResponseObject(res);
        } catch (error) {
            console.log(error);
            return new ResponseObject('', true);
        }
    }
}

module.exports.PinataIPFSClient = PinataIPFSClient;