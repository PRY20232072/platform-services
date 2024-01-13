// PRACTITIONERS VALIDATOR SCHEMAS
const CreatePractitionerValidatorSchema = {
    identifier: {
        in: ['body'],
        exists: {
            errorMessage: "identifier is required"
        }
    },
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'payload is required',
        }
    },
    'payload.name_id': {
        in: ['body'],
        exists: {
            errorMessage: "name_id is required"
        },
        notEmpty: {
            errorMessage: 'name_id can not be empty'
        }
    },
    'payload.gender': {
        in: ['body'],
        exists: {
            errorMessage: "gender is required"
        },
        isIn: {
            options: [['MALE', 'FEMALE']]
        },
        errorMessage: "gender is not valid",
        notEmpty: {
            errorMessage: 'gender can not be empty'
        }
    },
    'payload.birthDate': {
        in: ['body'],
        exists: {
            errorMessage: "birthDate is required"
        },
        notEmpty: {
            errorMessage: 'birthDate can not be empty'
        },
        matches: {
            options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
            errorMessage: 'birthDate has to be in format YYYY-MM-DD'
        }
    },
    'payload.maritalStatus': {
        in: ['body'],
        exists: {
            errorMessage: 'Marital status is required'
        },
        isIn: {
            options: [['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']]
        },
        errorMessage: "Marital status is not valid",
        notEmpty: {
            errorMessage: 'maritalStatus can not be empty'
        }
    },
    'payload.telephone': {
        in: ['body'],
        exists: {
            errorMessage: 'Telephone is required',
        },
        isLength: {
            options: {
                min: 9,
                max: 9
            },
        },
        errorMessage: "Telephone must be have 9 digits",
        notEmpty: {
            errorMessage: 'telephone can not be empty'
        }
    },
    'payload.address': {
        in: ['body'],
        exists: {
            errorMessage: 'Address is required',
        },
        notEmpty: {
            errorMessage: 'address can not be empty'
        }
    },
    'payload.address.type_address': {
        in: ['body'],
        exists: {
            errorMessage: 'Type address is required',
        },
        isIn: {
            options: [['POSTAL', 'PHYSICAL', 'BOTH']]
        },
        errorMessage: "Type address is not valid",
        notEmpty: {
            errorMessage: 'type_address can not be empty'
        }
    },
    'payload.address.address_line': {
        in: ['body'],
        exists: {
            errorMessage: 'Address line is required',
        },
        notEmpty: {
            errorMessage: 'address_line can not be empty'
        }
    },
    'payload.address.district': {
        in: ['body'],
        exists: {
            errorMessage: 'District is required',
        },
        notEmpty: {
            errorMessage: 'district can not be empty'
        }
    },
    'payload.address.city': {
        in: ['body'],
        exists: {
            errorMessage: 'City is required',
        },
        notEmpty: {
            errorMessage: 'city can not be empty'
        }
    },
    'payload.address.country': {
        in: ['body'],
        exists: {
            errorMessage: 'Country is required',
        },
        notEmpty: {
            errorMessage: 'country can not be empty'
        }
    },
    'payload.address.postal_code': {
        in: ['body'],
        exists: {
            errorMessage: 'Postal code is required',
        },
        notEmpty: {
            errorMessage: 'postal_code can not be empty'
        }
    },
    // 'payload.email': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'Email is required',
    //     },
    //     isEmail: true
    // },
}

const UpdatePractitionerValidatorSchema = {
    identifier: {
        in: ['params', 'query'],
        exists: {
            errorMessage: "Identifier is required"
        }
    },
    payload: {
        in: ['body'],
        exists: {
            errorMessage: 'Payload is required',
        }
    },
    'payload.name_id': {
        in: ['body'],
        exists: {
            errorMessage: "name_id is required"
        },
        notEmpty: {
            errorMessage: 'name_id can not be empty'
        }
    },
    'payload.gender': {
        in: ['body'],
        exists: {
            errorMessage: "gender is required"
        },
        isIn: {
            options: [['MALE', 'FEMALE']]
        },
        errorMessage: "gender is not valid",
        notEmpty: {
            errorMessage: 'gender can not be empty'
        }
    },
    'payload.birthDate': {
        in: ['body'],
        exists: {
            errorMessage: "birthDate is required"
        },
        notEmpty: {
            errorMessage: 'birthDate can not be empty'
        },
        matches: {
            options: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
            errorMessage: 'birthDate has to be in format YYYY-MM-DD'
        }
    },
    'payload.maritalStatus': {
        in: ['body'],
        exists: {
            errorMessage: 'Marital status is required'
        },
        isIn: {
            options: [['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']]
        },
        errorMessage: "Marital status is not valid",
        notEmpty: {
            errorMessage: 'maritalStatus can not be empty'
        }
    },
    'payload.telephone': {
        in: ['body'],
        exists: {
            errorMessage: 'Telephone is required',
        },
        isLength: {
            options: {
                min: 9,
                max: 9
            },
        },
        errorMessage: "Telephone must be have 9 digits",
        notEmpty: {
            errorMessage: 'telephone can not be empty'
        }
    },
    'payload.address': {
        in: ['body'],
        exists: {
            errorMessage: 'Address is required',
        },
        notEmpty: {
            errorMessage: 'address can not be empty'
        }
    },
    'payload.address.type_address': {
        in: ['body'],
        exists: {
            errorMessage: 'Type address is required',
        },
        isIn: {
            options: [['POSTAL', 'PHYSICAL', 'BOTH']]
        },
        errorMessage: "Type address is not valid",
        notEmpty: {
            errorMessage: 'type_address can not be empty'
        }
    },
    'payload.address.address_line': {
        in: ['body'],
        exists: {
            errorMessage: 'Address line is required',
        },
        notEmpty: {
            errorMessage: 'address_line can not be empty'
        }
    },
    'payload.address.district': {
        in: ['body'],
        exists: {
            errorMessage: 'District is required',
        },
        notEmpty: {
            errorMessage: 'district can not be empty'
        }
    },
    'payload.address.city': {
        in: ['body'],
        exists: {
            errorMessage: 'City is required',
        },
        notEmpty: {
            errorMessage: 'city can not be empty'
        }
    },
    'payload.address.country': {
        in: ['body'],
        exists: {
            errorMessage: 'Country is required',
        },
        notEmpty: {
            errorMessage: 'country can not be empty'
        }
    },
    'payload.address.postal_code': {
        in: ['body'],
        exists: {
            errorMessage: 'Postal code is required',
        },
        notEmpty: {
            errorMessage: 'postal_code can not be empty'
        }
    },
    // 'payload.email': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'Email is required',
    //     },
    //     isEmail: true
    // },
}
// END PRACTITIONERS VALIDATOR SCHEMAS

module.exports = {
    CreatePractitionerValidatorSchema: CreatePractitionerValidatorSchema,
    UpdatePractitionerValidatorSchema: UpdatePractitionerValidatorSchema
}