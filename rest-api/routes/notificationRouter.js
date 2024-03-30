var express = require('express');
var router = express.Router();
const { NotificationClient } = require('../clients/notification/NotificationClient');
const { checkSchema, validationResult } = require('express-validator');
const { CreateNotificationValidatorSchema, UpdateNotificationValidatorSchema } = require('./utils/ValidatorSchemas');
const { asyncErrorHandler } = require('./utils/asyncErrorHandler');

const client = new NotificationClient();

router.get('/:notification_id', asyncErrorHandler(async function (req, res) {
    const notification_id = req.params.notification_id;
    const current_user = req.current_user;

    const response = await client.getNotificationById(notification_id, current_user);

    res.send(response);
}));

router.get('/user/:user_id', asyncErrorHandler(async function (req, res) {
    const user_id = req.params.user_id;
    const current_user = req.current_user;

    const response = await client.getNotificationListByUserId(user_id, current_user);

    res.send(response);
}));

router.get('/user/:user_id/unread', asyncErrorHandler(async function (req, res) {
    const user_id = req.params.user_id;
    const current_user = req.current_user;

    const response = await client.getNotificationUnreadListByUserId(user_id, current_user);

    res.send(response);
}));

router.get('/user/:user_id/read', asyncErrorHandler(async function (req, res) {
    const user_id = req.params.user_id;
    const current_user = req.current_user;

    const response = await client.getNotificationReadListByUserId(user_id, current_user);

    res.send(response);
}));

router.post('/', checkSchema(CreateNotificationValidatorSchema), asyncErrorHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array()
        });
    }

    const payload = req.body;
    const current_user = req.current_user;

    const response = await client.createNotification(payload, current_user);

    res.send(response);
}));

router.put('/:notification_id', checkSchema(UpdateNotificationValidatorSchema), asyncErrorHandler(async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            errors: errors.array()
        });
    }

    const notification_id = req.params.notification_id;
    const payload = req.body;
    const current_user = req.current_user;

    const response = await client.updateNotification(notification_id, payload, current_user);

    res.send(response);
}));

module.exports = router;