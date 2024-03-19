var express = require('express');
var router = express.Router();
const { FamilyHistoryClient } = require('../clients/family/FamilyHistoryClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateFamilyHistoryValidatorSchema, UpdateFamilyHistoryValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new FamilyHistoryClient();

router.get('/', async function (req, res) {
    const current_user = req.current_user;

    await client.getFamilyHistoryList(current_user).then(function (response) {
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

    await client.getFamilyHistoryById(identifier, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/patient/:patient_id', async function (req, res) {
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    await client.getFamilyHistoryByPatientId(patient_id, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/:identifier/patient/:patient_id', async function (req, res) {
    const identifier = req.params.identifier;
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    await client.getAlleryByIdAndPatientId(identifier, patient_id, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', checkSchema(CreateFamilyHistoryValidatorSchema), async function (req, res) {
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

    await client.createFamilyHistory(identifier, payload, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.put('/:identifier', checkSchema(UpdateFamilyHistoryValidatorSchema), async function (req, res) {
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

    await client.updateFamilyHistory(identifier, payload, current_user).then(function (response) {
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
    const patient_id = req.query.patient_id;
    const current_user = req.current_user;
    
    await client.deleteFamilyHistory(identifier, patient_id, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;