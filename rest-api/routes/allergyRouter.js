var express = require('express');
var router = express.Router();
const { AllergyClient } = require('../clients/allergy/AllergyClient');

const client = new AllergyClient();

router.get('/', async function (req, res) {
    var address = client.getAddressList();
    await client.getList(address).then(function (response) {
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
    var patient_id = req.query.patient_id;
    var address = client.getAddress(patient_id, identifier);
    await client.getByIdentifier(address).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/:identifier/patient/:patient_id', async function (req, res) {
    var identifier = req.params.identifier;
    var patient_id = req.params.patient_id;
    await client.getAlleryByIdAndPatientId(identifier, patient_id).then(function (response) {
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
    await client.createAllergy(identifier, payload).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.put('/:identifier', async function (req, res) {
    var identifier = req.params.identifier;
    var payload = req.body.payload;
    await client.updateAllergy(identifier, payload).then(function (response) {
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
    var patient_id = req.query.patient_id;
    await client.deleteAllergy(identifier, patient_id).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;