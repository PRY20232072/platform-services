var express = require('express');
var router = express.Router();
const { ConsentClient } = require('../clients/consent/ConsentClient');

const client = new ConsentClient();

router.get('/patient/:patient_id', async function (req, res) {
    var patient_id = req.params.patient_id;
    var address = client.getAddress(patient_id);
    await client.getList(address).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/practitioner/:practitioner_id', async function (req, res) {
    var practitioner_id = req.params.practitioner_id;
    var address = client.getAddress(practitioner_id);
    await client.getList(address).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', async function (req, res) {
    var payload = req.body.payload;
    await client.createConsent(payload).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.delete('/patient/:patient_id/practitioner/:practitioner_id', async function (req, res) {
    var patient_id = req.params.patient_id;
    var practitioner_id = req.params.practitioner_id;
    await client.revokeConsent(patient_id, practitioner_id).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;