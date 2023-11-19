var express = require('express');
var allergyRouter = require('./routes/allergyRouter');
var patientRouter = require('./routes/patientRouter');
var practitionerRouter = require('./routes/practitionerRouter');
var consentRouter = require('./routes/consentRouter');

var app = express();

app.use(express.json());

//TODO: set the port with environment variable
var port = 80;
app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/AllergyIntolerance", allergyRouter);
app.use("/Patient", patientRouter);
app.use("/Practitioner", practitionerRouter);
app.use("/Consent", consentRouter)