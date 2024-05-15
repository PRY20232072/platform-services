var express = require('express');
var router = express.Router();
const { AllergyClient } = require('../clients/allergy/AllergyClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateAllergyValidatorSchema, UpdateAllergyValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new AllergyClient();

router.get('/:identifier/patient/:patient_id', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getAllergyById(identifier, patient_id, current_user);

    res.send(response);
}));

router.get('/patient/:patient_id', asyncErrorHandler(async function (req, res) {
    const patient_id = req.params.patient_id;
    const current_user = req.current_user;

    const response = await client.getAllergyListByPatientId(patient_id, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreateAllergyValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.createAllergy(identifier, payload, current_user);

    res.send(response);
}));

router.put('/:identifier', checkSchema(UpdateAllergyValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.updateAllergy(identifier, payload, current_user);

    res.send(response);
}));

router.delete('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const patient_id = req.query.patient_id;
    const current_user = req.current_user;

    const response = await client.deleteAllergy(identifier, patient_id, current_user);

    res.send(response);
}));

module.exports = router;