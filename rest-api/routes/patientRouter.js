var express = require('express');
var router = express.Router();
const { PatientClient } = require('../clients/patient/PatientClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePatientValidatorSchema, UpdatePatientValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new PatientClient();

router.get('/', async function (req, res) {
    await client.getPatientList().then(function (response) {
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
    await client.getPatientById(identifier).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', checkSchema(CreatePatientValidatorSchema), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array() 
        });
    }

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

router.put('/:identifier', checkSchema(UpdatePatientValidatorSchema), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array() 
        });
    }

    var identifier = req.params.identifier;
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