var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var allergyRouter = require('./routes/allergyRouter');
var familyHistoryRouter = require('./routes/familyHistoryRouter');
var patientRouter = require('./routes/patientRouter');
var practitionerRouter = require('./routes/practitionerRouter');
var consentRouter = require('./routes/consentRouter');
var notificationRouter = require('./routes/notificationRouter');
var filesRouter = require('./routes/filesRouter');
var attentionRouter = require('./routes/attentionRouter');
const authMiddleware = require('./routes/middlewares/authMiddleware');
const errorHandlerMiddleware = require('./routes/middlewares/errorHandlerMiddleware');
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    //https://stackoverflow.com/questions/64614350/how-to-set-custom-headers-on-express-and-receive-it-on-axios
    exposedHeaders: ["file-type"]
}));
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
app.use("/Notification", notificationRouter);
app.use("/Files", filesRouter);
app.use("/Attention", attentionRouter);

app.use(errorHandlerMiddleware);