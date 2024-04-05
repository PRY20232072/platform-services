var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
const { FilesClient } = require('../clients/files/FilesClient');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');
const { ConsensusNotifyAck } = require('sawtooth-sdk/protobuf');

const client = new FilesClient();

router.get('/:hash', asyncErrorHandler(async function (req, res) {
    const hash = req.params.hash;
    const response = await client.getFile(hash);
    
    res.send(response);
}));

router.post('/upload', upload.single('file'), asyncErrorHandler(async function (req, res) {
    console.log('req: ', req);
    console.log('req update: ', req.file);

    const current_user = req.current_user;

    // const formData = req.body;
    // const payload = req.body;
    // const current_user = req.current_user;

    const response = await client.uploadFile(req.file, {}, current_user);

    res.send(response);
}));

module.exports = router;