const FormData = require('form-data');
const { Constants } = require('./Constants');
const axios = require('axios');

class InfuraIPFSClient {
    constructor() {
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
    }

    async add(data) {
        var response = {
            hash: '',
            error: true
        };

        var fd = new FormData();
        fd.append('file', JSON.stringify(data));
        await this.instance.post('/add', fd)
            .then((res) => {
                response.hash = res.data.Hash;
                response.error = false;
            })
            .catch((error) => {
                console.error(error)
            });

        return response;
    }

    async cat(hash) {
        var response = {
            data: '',
            error: true
        };

        await this.instance.post('/cat', {}, {
                params: {
                    arg: hash
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

    async rm(hash) {
        var response = {
            data: '',
            error: true
        };
        await this.instance.post('/pin/rm', {}, {
                params: {
                    arg: hash
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

module.exports.InfuraIPFSClient = InfuraIPFSClient;