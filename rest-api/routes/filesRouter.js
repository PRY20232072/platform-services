var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
const { FilesClient } = require('../clients/files/FilesClient');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');
const FileType = require('file-type');

const client = new FilesClient();

router.get('/:hash', asyncErrorHandler(async function (req, res) {
    const hash = req.params.hash;
    const response = await client.getFile(hash);
    const type = await FileType.fromBuffer(response);
    res.setHeader('file-type', type.mime);
    res.send(response);
}));

router.post('/upload', upload.single('file'), asyncErrorHandler(async function (req, res) {
    const created_date = req.query.created_date;
    const file_name = req.query.file_name;
    const file_type = req.query.file_type;
    const patient_id = req.query.patient_id;
    const payload = {
        created_date: created_date,
        file_name: file_name,
        file_type: file_type,
        patient_id: patient_id
    };
    const current_user = req.current_user;

    const response = await client.uploadFile(req.file, payload, current_user);

    res.send(response);
}));

module.exports = router;