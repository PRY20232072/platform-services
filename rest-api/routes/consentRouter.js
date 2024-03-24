var express = require('express');
var router = express.Router();
const { ConsentClient } = require('../clients/consent/ConsentClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateConsentValidatorSchema, ApproveConsentValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new ConsentClient();

router.get('/register/:register_id', asyncErrorHandler(async function (req, res) {
    var register_id = req.params.register_id;

    const response = await client.getConsentByRegisterId(register_id);

    res.send(response);
}));

router.get('/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    var practitioner_id = req.params.practitioner_id;

    const response = await client.getConsentByPractitionerId(practitioner_id);

    res.send(response);
}));

router.get('/register/:register_id/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    var register_id = req.params.register_id;
    var practitioner_id = req.params.practitioner_id;

    const response = await client.getConsentByRegisterIdAndPractitionerId(register_id, practitioner_id);

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

    var payload = req.body.payload;

    const response = await client.createConsent(payload);

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

    var register_id = req.params.register_id;
    var practitioner_id = req.params.practitioner_id;

    const response = await client.approveConsent(register_id, practitioner_id);

    res.send(response);
}));

router.delete('/register/:register_id/practitioner/:practitioner_id', asyncErrorHandler(async function (req, res) {
    var register_id = req.params.register_id;
    var practitioner_id = req.params.practitioner_id;

    const response = await client.revokeConsent(register_id, practitioner_id);

    res.send(response);
}));

module.exports = router;