const CreateFamilyHistoryValidatorSchema = {
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
        },
        notEmpty: {
            errorMessage: 'payload can not be empty'
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
    'payload.name': {
        in: ['body'],
        exists: {
            errorMessage: 'name is required'
        },
        notEmpty: {
            errorMessage: 'name can not be empty'
        }
    },
    'payload.reason': {
        in: ['body'],
        exists: {
            errorMessage: 'reason is required'
        },
        notEmpty: {
            errorMessage: 'reason can not be empty'
        }
    },
    'payload.notes': {
        in: ['body'],
        exists: {
            errorMessage: 'notes is required'
        },
        notEmpty: {
            errorMessage: 'notes can not be empty'
        }
    },
    'payload.clinical_status': {
        in: ['body'],
        exists: {
            errorMessage: 'clinical_status is required'
        },
        isIn: {
            options: [['PARTIAL', 'COMPLETE', 'UNKNOWN']],
        },
        errorMessage: "clinical_status is not valid",
        notEmpty: {
            errorMessage: 'clinical_status can not be empty'
        }
    },
    'payload.recorded_date': {
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
        notEmpty: {
    // 'payload.patient.name': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'patient name is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient name can not be empty'
    //     },
    // },
    // 'payload.patient.gender': {
    //     in: ['body'],
    //     errorMessage: "patient gender is not valid",
    //     exists: {
    //         errorMessage: "patient gender is required"
    //     },
    //     isIn: {
    //         options: [['MALE', 'FEMALE']]
    //     },
    //     notEmpty: {
    //         errorMessage: 'gender can not be empty'
    //     },
    // },
    // 'payload.patient.relative_birthdate': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: "patient relative_birthdate is required"
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient relative_birthdate can not be empty'
    //     },
    //     matches: {
    //         options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
    //         errorMessage: 'patient relative_birthdate has to be in format YYYY-MM-DD'
    //     }
    // },
    // 'payload.patient.age': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: "patient age is required"
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient age can not be empty'
    //     }
    // }
}

const UpdateFamilyHistoryValidatorSchema = {
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required'
        },
        notEmpty: {
            errorMessage: 'payload can not be empty'
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
    'payload.name': {
        in: ['body'],
        exists: {
            errorMessage: 'name is required'
        },
        notEmpty: {
            errorMessage: 'name can not be empty'
        }
    },
    'payload.reason': {
        in: ['body'],
        exists: {
            errorMessage: 'reason is required'
        },
        notEmpty: {
            errorMessage: 'reason can not be empty'
        }
    },
    'payload.notes': {
        in: ['body'],
        exists: {
            errorMessage: 'notes is required'
        },
        notEmpty: {
            errorMessage: 'notes can not be empty'
        }
    },
    'payload.clinical_status': {
        in: ['body'],
        exists: {
            errorMessage: 'clinical_status is required'
        },
        isIn: {
            options: [['PARTIAL', 'COMPLETE', 'UNKNOWN']],
        },
        errorMessage: "clinical_status is not valid",
        notEmpty: {
            errorMessage: 'clinical_status can not be empty'
        }
    },
    'payload.recorded_date': {
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
    // 'payload.patient.name': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'patient name is required'
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient name can not be empty'
    //     },
    // },
    // 'payload.patient.gender': {
    //     in: ['body'],
    //     errorMessage: "patient gender is not valid",
    //     exists: {
    //         errorMessage: "patient gender is required"
    //     },
    //     isIn: {
    //         options: [['MALE', 'FEMALE']]
    //     },
    //     notEmpty: {
    //         errorMessage: 'gender can not be empty'
    //     },
    // },
    // 'payload.patient.relative_birthdate': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: "patient relative_birthdate is required"
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient relative_birthdate can not be empty'
    //     },
    //     matches: {
    //         options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
    //         errorMessage: 'patient relative_birthdate has to be in format YYYY-MM-DD'
    //     }
    // },
    // 'payload.patient.age': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: "patient age is required"
    //     },
    //     notEmpty: {
    //         errorMessage: 'patient age can not be empty'
    //     }
    // }
}

module.exports = {
    CreateFamilyHistoryValidatorSchema,
    UpdateFamilyHistoryValidatorSchema
}