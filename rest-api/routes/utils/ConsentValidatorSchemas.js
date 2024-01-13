const CreateConsentValidatorSchema = {
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required',
        }
    },
    'payload.register_id': {
        in: ['body'],
        exists: {
            errorMessage: 'register_id is required',
        },
        notEmpty: {
            errorMessage: 'register_id can not be empty'
        }
    },
    'payload.practitioner_id': {
        in: ['body'],
        exists: {
            errorMessage: 'practitioner_id is required',
        },
        notEmpty: {
            errorMessage: 'practitioner_id can not be empty'
        }
    },
    'payload.register_type': {
        in: ['body'],
        exists: {
            errorMessage: 'register_type is required',
        },
        isIn: {
            options: [['ALLERGY', 'FAMILY_HISTORY']]
        },
        errorMessage: "Register type is not valid",
        notEmpty: {
            errorMessage: 'register_type can not be empty'
        }
    }
}

const ApproveConsentValidatorSchema = {
    register_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "register_id is required"
        }
    },
    practitioner_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "Practitioner id is required"
        }
    }
}

module.exports = {
    CreateConsentValidatorSchema,
    ApproveConsentValidatorSchema
}