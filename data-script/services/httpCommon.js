const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4002',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, File-Type',
  },
});

module.exports.axiosInstance = axiosInstance;