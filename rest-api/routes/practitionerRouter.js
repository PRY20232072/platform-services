var express = require('express');
var router = express.Router();
const { PractitionerClient } = require('../clients/practitioner/PractitionerClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePractitionerValidatorSchema, UpdatePractitionerValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new PractitionerClient();

router.get('/', async function (req, res) {
    const current_user = req.current_user;

    await client.getPractitionerList(current_user).then(function (response) {
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

    await client.getPractitionerById(identifier, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', checkSchema(CreatePractitionerValidatorSchema), async function (req, res) {
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

    await client.createPractitioner(identifier, payload, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.put('/:identifier', checkSchema(UpdatePractitionerValidatorSchema), async function (req, res) {
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

    await client.updatePractitioner(identifier, payload, current_user).then(function (response) {
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

    await client.deletePractitioner(identifier, current_user).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;