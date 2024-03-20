var express = require('express');
var router = express.Router();
const { PatientClient } = require('../clients/patient/PatientClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePatientValidatorSchema, UpdatePatientValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new PatientClient();

router.get('/', async function (req, res) {
    const current_user = req.current_user;

    await client.getPatientList(current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/:identifier', async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    await client.getPatientById(identifier, current_user).then(function (response) {
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

    const identifier = req.body.identifier;
    const payload = req.body.payload;
    const current_user = req.current_user;

    await client.createPatient(identifier, payload, current_user).then(function (response) {
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

    const identifier = req.params.identifier;
    const payload = req.body.payload;
    const current_user = req.current_user;

    await client.updatePatient(identifier, payload, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.delete('/:identifier', async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    await client.deletePatient(identifier, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;