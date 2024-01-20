const FormData = require('form-data');
const { Constants } = require('../Constants');
const axios = require('axios');

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

            return {
                data: res.data.Hash,
                error: false
            }
        }
        catch (error) {
            console.log(error);

            return {
                data: '',
                error: true
            }
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

            return {
                data: res.data,
                error: false
            }
        } catch (error) {
            console.log(error);

            return {
                data: '',
                error: true
            }
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

            return {
                data: res.data,
                error: false
            }
        } catch (error) {
            console.log(error);

            return {
                data: '',
                error: true
            }
        }
    }
}

module.exports.InfuraIPFSClient = InfuraIPFSClient;