var express = require('express');
var router = express.Router();
const { ConsentClient } = require('../clients/consent/ConsentClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateConsentValidatorSchema, ApproveConsentValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new ConsentClient();

router.get('/register/:register_id', asyncErrorHandler(async function (req, res) {
    const register_id = req.params.register_id;
    const current_user = req.current_user;

    const response = await client.getConsentByRegisterId(register_id, current_user);

    res.send(response);
}));

router.get('/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    const practitioner_id = req.params.practitioner_id;
    const current_user = req.current_user;

    const response = await client.getConsentByPractitionerId(practitioner_id, current_user);

    res.send(response);
}));

router.get('/register/:register_id/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    const register_id = req.params.register_id;
    const practitioner_id = req.params.practitioner_id;
    const current_user = req.current_user;

    const response = await client.getConsentByRegisterIdAndPractitionerId(register_id, practitioner_id, current_user);

    res.send(response);
}));

router.get('/patient/:patient_id/active', asyncErrorHandler(async function (req, res) {
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getActiveConsentListByPatientId(patient_id, current_user);

    res.send(response);
}));

router.get('/patient/:patient_id/pending', asyncErrorHandler(async function (req, res) {
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getPendingConsentListByPatientId(patient_id, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreateConsentValidatorSchema), asyncErrorHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array()
        });
    }

    const payload = req.body.payload;
    const current_user = req.current_user;

    const response = await client.createConsent(payload, current_user);

    res.send(response);
}));

router.put('/register/:register_id/practitioner/:practitioner_id', checkSchema(ApproveConsentValidatorSchema), asyncErrorHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array()
        });
    }

    const register_id = req.params.register_id;
    const practitioner_id = req.params.practitioner_id;
    const current_user = req.current_user;

    const response = await client.approveConsent(register_id, practitioner_id, current_user);

    res.send(response);
}));

router.delete('/register/:register_id/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    const register_id = req.params.register_id;
    const practitioner_id = req.params.practitioner_id;
    const current_user = req.current_user;

    const response = await client.revokeConsent(register_id, practitioner_id, current_user);

    res.send(response);
}));

module.exports = router;