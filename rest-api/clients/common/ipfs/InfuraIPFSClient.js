const FormData = require('form-data');
const { Constants } = require('../Constants');
const axios = require('axios');
const { ResponseObject } = require('../ResponseObject');
const { CustomError } = require('../errors/CustomError');

class InfuraIPFSClient {
    constructor() {
        if (InfuraIPFSClient.instance) {
            return InfuraIPFSClient.instance;
        }

        this.instance = axios.create({
            baseURL: Constants.IPFS_INFURA_URL,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
            auth: {
                username: Constants.IPFS_INFURA_API_KEY,
                password: Constants.IPFS_INFURA_API_KEY_SECRET,
            },
        });

        InfuraIPFSClient.instance = this;
    }

    /**
     * Adds data to the IPFS network.
     * @param {Object} data - The data to be added.
     * @returns {Object} - An object containing the added data and an error flag.
     */
    async add(data) {
        try {
            var fd = new FormData();
            fd.append('file', JSON.stringify(data));
            const res = await this.instance.post('/add', fd);
            return new ResponseObject(res.data.Hash);
        }
        catch (error) {
            console.log(error);
            throw new CustomError(
                Constants.ERROR_ADDING_TO_IPFS,
                error.message,
            );
        }
    }

    /**
     * Retrieves the content of a file from IPFS using the given hash.
     * @param {string} hash - The hash of the file to retrieve.
     * @returns {Promise<{ data: any, error: boolean }>} - The retrieved data and an error flag indicating if an error occurred.
     */
    async cat(hash) {
        try {
            const res = await this.instance.post('/cat', {}, {
                params: {
                    arg: hash
                }
            });
            return new ResponseObject(res.data);
        } catch (error) {
            console.log(error);
            throw new CustomError(
                Constants.ERROR_RETRIEVING_FROM_IPFS,
                error.message,
            );
        }
    }

    /**
     * Removes a pinned IPFS hash from Infura IPFS.
     * @param {string} hash - The IPFS hash to be removed.
     * @returns {Promise<{ data: any, error: boolean }>} - The result of the removal operation.
     */
    async rm(hash) {
        try {
            const res = await this.instance.post('/pin/rm', {}, {
                params: {
                    arg: hash
                }
            });
            return new ResponseObject(res.data);
        } catch (error) {
            console.log(error);
            throw new CustomError(
                Constants.ERROR_DELETING_FROM_IPFS,
                error.message,
            );
        }
    }
}

module.exports.InfuraIPFSClient = InfuraIPFSClient;