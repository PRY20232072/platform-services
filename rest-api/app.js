var express = require('express');
var allergyRouter = require('./routes/allergyRouter');
var patientRouter = require('./routes/patientRouter');
var practitionerRouter = require('./routes/practitionerRouter');
var consentRouter = require('./routes/consentRouter');

var app = express();

app.use(express.json());

app.listen(3000, function () {
    console.log("Server running on port 3000");
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/AllergyIntolerance", allergyRouter);
app.use("/Patient", patientRouter);
app.use("/Practitioner", practitionerRouter);
app.use("/Consent", consentRouter)