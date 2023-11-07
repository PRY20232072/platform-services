var express = require('express');
var router = express.Router();
const { PatientClient } = require('../clients/patient/PatientClient');

const client = new PatientClient();

router.get('/', async function (req, res) {
    await client.getList().then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/:identifier', async function (req, res) {
    var identifier = req.params.identifier;
    await client.getByIdentifier(identifier).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', async function (req, res) {
    var identifier = req.body.identifier;
    var payload = req.body.payload;
    await client.createPatient(identifier, payload).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.put('/', async function (req, res) {
    var identifier = req.body.identifier;
    var payload = req.body.payload;
    await client.updatePatient(identifier, payload).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.delete('/:identifier', async function (req, res) {
    var identifier = req.params.identifier;
    await client.deletePatient(identifier).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;