const CreateConsentValidatorSchema = {
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required',
        }
    },
    'payload.patient_id': {
        in: ['body'],
        exists: {
            errorMessage: 'patient_id is required',
        },
        notEmpty: {
            errorMessage: 'patient_id can not be empty'
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
}

const ApproveConsentValidatorSchema = {
    patient_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "patient_id is required"
        }
    },
    practitioner_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "Practitioner id is required"
        }
    }
}

const RevokeConsentValidatorSchema = {
    patient_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "patient_id is required"
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
    ApproveConsentValidatorSchema,
    RevokeConsentValidatorSchema
}