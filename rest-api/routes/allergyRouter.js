var express = require('express');
var router = express.Router();
const { AllergyClient } = require('../clients/allergy/AllergyClient');

const client = new AllergyClient();

router.get('/', function (req, res) {
    client.getAllergyList().then(function (allergy) {
        console.log("Allergies: " + JSON.stringify(allergy));
        res.send(allergy);
    });
});

router.get('/:identifier', function (req, res) {
    var identifier = req.params.identifier;
    client.getAllergy(identifier).then(function (allergy) {
        console.log("Allergy: " + JSON.stringify(allergy));
        res.send(allergy);
    });
});

router.post('/', function (req, res) {
    var identifier = req.body.identifier;
    var payload = req.body.payload;
    client.createAllergy(identifier, payload);
    res.send('Allergy transaction submitted');
});

router.put('/', function (req, res) {
    var identifier = req.body.identifier;
    var payload = req.body.payload;
    client.updateAllergy(identifier, payload);
    res.send('Allergy transaction submitted');
});

router.delete('/:identifier', function (req, res) {
    var identifier = req.params.identifier;
    client.deleteAllergy(identifier);
    res.send('Allergy transaction submitted');
});

module.exports = router;