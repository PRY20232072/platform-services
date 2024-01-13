var express = require('express');
var router = express.Router();
const { AllergyClient } = require('../clients/allergy/AllergyClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateAllergyValidatorSchema, UpdateAllergyValidatorSchema } = require('./utils/ValidatorSchemas');

const client = new AllergyClient();

router.get('/', async function (req, res) {
    await client.getAllergyList().then(function (response) {
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
    await client.getAllergyById(identifier).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/patient/:patient_id', async function (req, res) {
    var patient_id = req.params.patient_id;
    await client.getAllergyByPatientId(patient_id).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.get('/:identifier/patient/:patient_id', async function (req, res) {
    var identifier = req.params.identifier;
    var patient_id = req.params.patient_id;
    var practitioner_id = req.query.practitioner_id;
    await client.getAlleryByIdAndPatientId(identifier, patient_id, practitioner_id).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.post('/', checkSchema(CreateAllergyValidatorSchema), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array() 
        });
    }

    var identifier = req.body.identifier;
    var payload = req.body.payload;
    await client.createAllergy(identifier, payload).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

router.put('/:identifier', checkSchema(UpdateAllergyValidatorSchema), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array() 
        });
    }

    var identifier = req.params.identifier;
    var practitioner_id = req.query.practitioner_id;
    var payload = req.body.payload;
    await client.updateAllergy(identifier, practitioner_id, payload).then(function (response) {
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
    var patient_id = req.query.patient_id;
    var practitioner_id = req.query.practitioner_id;
    await client.deleteAllergy(identifier, patient_id, practitioner_id).then(function (response) {
        if (response.error) {
            res.status(404).send(response);
        }
        else {
            res.send(response);
        }
    });
});

module.exports = router;