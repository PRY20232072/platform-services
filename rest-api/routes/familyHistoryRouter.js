var express = require('express');
var router = express.Router();
const { FamilyHistoryClient } = require('../clients/family/FamilyHistoryClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateFamilyHistoryValidatorSchema, UpdateFamilyHistoryValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new FamilyHistoryClient();

router.get('/', asyncErrorHandler(async function (req, res) {
    const current_user = req.current_user;

    const response = await client.getFamilyHistoryList(current_user);

    res.send(response);
}));

router.get('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    const response = await client.getFamilyHistoryById(identifier, current_user);

    res.send(response);
}));

router.get('/patient/:patient_id', asyncErrorHandler(async function (req, res) {
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getFamilyHistoryByPatientId(patient_id, current_user);

    res.send(response);
}));

router.get('/:identifier/patient/:patient_id', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getFamilyHistoryByIdAndPatient(identifier, patient_id, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreateFamilyHistoryValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.createFamilyHistory(identifier, payload, current_user);

    res.send(response);
}));

router.put('/:identifier', checkSchema(UpdateFamilyHistoryValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.updateFamilyHistory(identifier, payload, current_user);

    res.send(response);
}));

router.delete('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const patient_id = req.query.patient_id;
    const current_user = req.current_user;
    
    const response = await client.deleteFamilyHistory(identifier, patient_id, current_user);

    res.send(response);
}));

module.exports = router;