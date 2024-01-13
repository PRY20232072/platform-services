const CreateAllergyValidatorSchema = {
    identifier: {
        in: ['body'],
        exists: {
            errorMessage: 'identifier is required'
        },
        notEmpty: {
            errorMessage: 'identifier can not be empty'
        }
    },
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required'
        }
    },
    'payload.patient_id': {
        in: ['body'],
        exists: {
            errorMessage: 'patient_id is required'
        },
        notEmpty: {
            errorMessage: 'patient_id can not be empty'
        }
    },
    'payload.participant_id': {
        in: ['body'],
        exists: {
            errorMessage: 'participant_id is required'
        },
        notEmpty: {
            errorMessage: 'participant_id can not be empty'
        }
    },
    'payload.type': {
        in: ['body'],
        exists: {
            errorMessage: 'type is required'
        },
        isIn: {
            options: [['DAIRY', 'GLUTEN', 'CAFFEINE', 'SALICYLATES', 'AMINES', 'OTHER']],
        },
        errorMessage: "type is not valid",
        notEmpty: {
            errorMessage: 'type can not be empty'
        }
    },
    'payload.category': {
        in: ['body'],
        exists: {
            errorMessage: 'category is required'
        },
        isIn: {
            options: [['FOOD', 'ENVIRONMENT', 'MEDICATION', 'BIOLOGIC']],
        },
        errorMessage: "category is not valid",
        notEmpty: {
            errorMessage: 'category can not be empty'
        }
    },
    'payload.clinical_status': {
        in: ['body'],
        exists: {
            errorMessage: 'clinical_status is required'
        },
        isIn: {
            options: [['ACTIVE', 'INACTIVE', 'RESOLVED']],
        },
        errorMessage: "clinical_status is not valid",
        notEmpty: {
            errorMessage: 'clinical_status can not be empty'
        }
    },
    "payload.recorded_date": {
        in: ['body'],
        exists: {
            errorMessage: 'recorded_date is required'
        },
        notEmpty: {
            errorMessage: 'recorded_date can not be empty'
        },
        matches: {
            options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
            errorMessage: 'recorded_date has to be in format YYYY-MM-DD'
        }
    },
    "payload.allergy_notes": {
        in: ['body'],
        exists: {
            errorMessage: 'allergy_notes is required'
        },
        notEmpty: {
            errorMessage: 'allergy_notes can not be empty'
        }
    },
    // 'payload.criticality': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'criticality is required'
    //     },

    // },
    // 'payload.severity': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'severity is required'
    //     }
    // },
    // "payload.verification_status": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'verification_status is required'
    //     }
    // },
    // "payload.onset_date": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'onset_date is required'
    //     }
    // },
    // "payload.last_occurrence": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'last_occurrence is required'
    //     }
    // },
}

const UpdateAllergyValidatorSchema = {
    identifier: {
        in: ['params', 'query'],
        exists: {
            errorMessage: 'identifier is required'
        }
    },
    practitioner_id: {
        in: ['params', 'query'],
        exists: {
            errorMessage: 'practitioner_id is required'
        }
    },
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required'
        }
    },
    'payload.patient_id': {
        in: ['body'],
        exists: {
            errorMessage: 'patient_id is required'
        },
        notEmpty: {
            errorMessage: 'patient_id can not be empty'
        }
    },
    'payload.participant_id': {
        in: ['body'],
        exists: {
            errorMessage: 'participant_id is required'
        },
        notEmpty: {
            errorMessage: 'participant_id can not be empty'
        }
    },
    'payload.type': {
        in: ['body'],
        exists: {
            errorMessage: 'type is required'
        },
        isIn: {
            options: [['DAIRY', 'GLUTEN', 'CAFFEINE', 'SALICYLATES', 'AMINES', 'OTHER']],
        },
        errorMessage: "type is not valid",
        notEmpty: {
            errorMessage: 'type can not be empty'
        }
    },
    'payload.category': {
        in: ['body'],
        exists: {
            errorMessage: 'category is required'
        },
        isIn: {
            options: [['FOOD', 'ENVIRONMENT', 'MEDICATION', 'BIOLOGIC']],
        },
        errorMessage: "category is not valid",
        notEmpty: {
            errorMessage: 'category can not be empty'
        }
    },
    'payload.clinical_status': {
        in: ['body'],
        exists: {
            errorMessage: 'clinical_status is required'
        },
        isIn: {
            options: [['ACTIVE', 'INACTIVE', 'RESOLVED']],
        },
        errorMessage: "clinical_status is not valid",
        notEmpty: {
            errorMessage: 'clinical_status can not be empty'
        }
    },
    "payload.recorded_date": {
        in: ['body'],
        exists: {
            errorMessage: 'recorded_date is required'
        },
        notEmpty: {
            errorMessage: 'recorded_date can not be empty'
        },
        matches: {
            options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
            errorMessage: 'recorded_date has to be in format YYYY-MM-DD'
        }
    },
    "payload.allergy_notes": {
        in: ['body'],
        exists: {
            errorMessage: 'allergy_notes is required'
        },
        notEmpty: {
            errorMessage: 'allergy_notes can not be empty'
        }
    },
    // 'payload.criticality': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'criticality is required'
    //     },
    // },
    // 'payload.severity': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'severity is required'
    //     }
    // },
    // "payload.verification_status": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'verification_status is required'
    //     }
    // },
    // "payload.onset_date": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'onset_date is required'
    //     }
    // },
    // "payload.last_occurrence": {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'last_occurrence is required'
    //     }
    // },
}

module.exports = {
    CreateAllergyValidatorSchema,
    UpdateAllergyValidatorSchema
}