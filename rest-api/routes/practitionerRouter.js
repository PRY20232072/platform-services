var express = require('express');
var router = express.Router();
const { PractitionerClient } = require('../clients/practitioner/PractitionerClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreatePractitionerValidatorSchema, UpdatePractitionerValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new PractitionerClient();

router.get('/', async function (req, res) {
    await client.getPractitionerList().then(function (response) {
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
    await client.getPractitionerById(identifier).then(function (response) {
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

    var identifier = req.body.identifier;
    var payload = req.body.payload;
    await client.createPractitioner(identifier, payload).then(function (response) {
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

    var identifier = req.params.identifier;
    var payload = req.body.payload;
    await client.updatePractitioner(identifier, payload).then(function (response) {
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
    await client.deletePractitioner(identifier).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;