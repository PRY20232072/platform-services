const CreateNotificationValidatorSchema = {
    user_id: {
        in: ['body'],
        exists: {
            errorMessage: 'ideuser_id is required'
        },
        notEmpty: {
            errorMessage: 'user_id can not be empty'
        }
    },
    type: {
        in: ['body'],
        exists: {
            errorMessage: 'type is required'
        },
        isIn: {
            options: [['READ', 'WRITE', 'MESSAGE']],
        },
        errorMessage: 'type is not valid',
        notEmpty: {
            errorMessage: 'type can not be empty'
        }
    },
};

const UpdateNotificationValidatorSchema = {
    read: {
        in: ['body'],
        exists: {
            errorMessage: 'read is required'
        },
        isBoolean: {
            errorMessage: 'read must be a boolean'
        }
    },
};

module.exports = {
    CreateNotificationValidatorSchema,
    UpdateNotificationValidatorSchema
};
