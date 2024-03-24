var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var allergyRouter = require('./routes/allergyRouter');
var familyHistoryRouter = require('./routes/familyHistoryRouter');
var patientRouter = require('./routes/patientRouter');
var practitionerRouter = require('./routes/practitionerRouter');
var consentRouter = require('./routes/consentRouter');
const authMiddleware = require('./routes/middlewares/authMiddleware');
const errorHandlerMiddleware = require('./routes/middlewares/errorHandlerMiddleware');
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

var port = process.env.PORT || 80;
app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});

// jwt middleware
app.use(authMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/AllergyIntolerance", allergyRouter);
app.use("/Patient", patientRouter);
app.use("/Practitioner", practitionerRouter);
app.use("/Consent", consentRouter);
app.use("/FamilyHistory", familyHistoryRouter);

app.use(errorHandlerMiddleware);