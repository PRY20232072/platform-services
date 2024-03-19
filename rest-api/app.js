var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var allergyRouter = require('./routes/allergyRouter');
var familyHistoryRouter = require('./routes/familyHistoryRouter');
var patientRouter = require('./routes/patientRouter');
var practitionerRouter = require('./routes/practitionerRouter');
var consentRouter = require('./routes/consentRouter');
var { validateAccessToken } = require('./routes/utils/ADDTokenValidator');
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
app.use(function (req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        validateAccessToken(token)
            .then(decodedToken => {
                const current_user = {
                    id: decodedToken.oid,
                    role: decodedToken.extension_UserRole
                }
                
                req.decodedToken = decodedToken;
                req.current_user = current_user;
                next();
            })
            .catch(error => {
                res.status(403).json({ error: error.message });
            });
    } else {
        res.status(403).json({ error: 'No token provided' });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/AllergyIntolerance", allergyRouter);
app.use("/Patient", patientRouter);
app.use("/Practitioner", practitionerRouter);
app.use("/Consent", consentRouter);
app.use("/FamilyHistory", familyHistoryRouter);