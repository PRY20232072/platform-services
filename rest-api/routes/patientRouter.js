var express = require('express');
var router = express.Router();
const { PatientClient } = require('../clients/patient/PatientClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePatientValidatorSchema, UpdatePatientValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new PatientClient();

router.get('/', asyncErrorHandler(async function (req, res) {
    const current_user = req.current_user;

    const response = await client.getPatientList(current_user);

    res.send(response);
}));

router.get('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    const response = await client.getPatientById(identifier, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreatePatientValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.createPatient(identifier, payload, current_user);

    res.send(response);
}));

router.put('/:identifier', checkSchema(UpdatePatientValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.updatePatient(identifier, payload, current_user);

    res.send(response);
}));

router.delete('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    const response = await client.deletePatient(identifier, current_user);

    res.send(response);
}));

module.exports = router;