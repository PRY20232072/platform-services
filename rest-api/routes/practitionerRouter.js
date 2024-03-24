var express = require('express');
var router = express.Router();
const { PractitionerClient } = require('../clients/practitioner/PractitionerClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePractitionerValidatorSchema, UpdatePractitionerValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new PractitionerClient();

router.get('/', asyncErrorHandler(async function (req, res) {
    const current_user = req.current_user;

    const response = await client.getPractitionerList(current_user);

    res.send(response);
}));

router.get('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    const response = await client.getPractitionerById(identifier, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreatePractitionerValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.createPractitioner(identifier, payload, current_user);

    res.send(response);
}));

router.put('/:identifier', checkSchema(UpdatePractitionerValidatorSchema), asyncErrorHandler(async function (req, res) {
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

    const response = await client.updatePractitioner(identifier, payload, current_user);

    res.send(response);
}));

router.delete('/:identifier', asyncErrorHandler(async function (req, res) {
    const identifier = req.params.identifier;
    const current_user = req.current_user;

    const response = await client.deletePractitioner(identifier, current_user);

    res.send(response);
}));

module.exports = router;
