// PATIENTS VALIDATOR SCHEMAS
const CreatePatientValidatorSchema = {
    identifier: {
        in: ['body'],
        exists: {
            errorMessage: "identifier is required"
        },
        notEmpty: {
            errorMessage: 'identifier can not be empty'
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
    'payload.last_name': {
        in: ['body'],
        exists: {
            errorMessage: "last_name is required"
        },
        notEmpty: {
            errorMessage: 'last_name can not be empty'
        }
    },
    'payload.gender': {
        in: ['body'],
        errorMessage: "gender is not valid",
        exists: {
            errorMessage: "gender is required"
        },
        isIn: {
            options: [['MALE', 'FEMALE']]
        },
        notEmpty: {
            errorMessage: 'gender can not be empty'
        },
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
        errorMessage: "maritalStatus is not valid",
        exists: {
            errorMessage: 'maritalStatus is required'
        },
        isIn: {
            options: [['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']]
        },
        notEmpty: {
            errorMessage: 'maritalStatus can not be empty'
        },
    },
    'payload.telephone': {
        in: ['body'],
        exists: {
            errorMessage: 'telephone is required',
        },
        isLength: {
            options: {
                min: 9,
                max: 9
            },
        },
        errorMessage: "telephone must be have 9 digits",
        notEmpty: {
            errorMessage: 'telephone can not be empty'
        },
    },
    // 'payload.email': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'email is required',
    //     },
    //     isEmail: true
    // },
    'payload.address': {
        in: ['body'],
        exists: {
            errorMessage: 'address is required',
        },
        notEmpty: {
            errorMessage: 'address can not be empty'
        },
    },
    'payload.address.type_address': {
        in: ['body'],
        exists: {
            errorMessage: 'type_address is required',
        },
        isIn: {
            options: [['POSTAL', 'PHYSICAL', 'BOTH']]
        },
        errorMessage: "type_address is not valid",
        notEmpty: {
            errorMessage: 'type_address can not be empty'
        },
    },
    'payload.address.address_line': {
        in: ['body'],
        exists: {
            errorMessage: 'address_line is required',
        },
        notEmpty: {
            errorMessage: 'address_line can not be empty'
        },
    },
    'payload.address.district': {
        in: ['body'],
        exists: {
            errorMessage: 'district is required',
        },
        notEmpty: {
            errorMessage: 'district can not be empty'
        },
    },
    'payload.address.department': {
        in: ['body'],
        exists: {
            errorMessage: 'department is required',
        },
        notEmpty: {
            errorMessage: 'department can not be empty'
        },
    },
    'payload.address.province': {
        in: ['body'],
        exists: {
            errorMessage: 'province is required',
        },
        notEmpty: {
            errorMessage: 'province can not be empty'
        }
    },
  
}

const UpdatePatientValidatorSchema = {
    identifier: {
        in: ['params', 'query'],
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
    'payload.last_name': {
        in: ['body'],
        exists: {
            errorMessage: "last_name is required"
        },
        notEmpty: {
            errorMessage: 'last_name can not be empty'
        }
    },
    'payload.gender': {
        in: ['body'],
        errorMessage: "gender is not valid",
        exists: {
            errorMessage: "gender is required"
        },
        isIn: {
            options: [['MALE', 'FEMALE']]
        },
        notEmpty: {
            errorMessage: 'gender can not be empty'
        },
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
            errorMessage: 'birthDate format is invalid (YYYY-MM-DD)'
        }
    },
    'payload.maritalStatus': {
        in: ['body'],
        errorMessage: "maritalStatus is not valid",
        exists: {
            errorMessage: 'maritalStatus is required'
        },
        isIn: {
            options: [['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']]
        },
        notEmpty: {
            errorMessage: 'maritalStatus can not be empty'
        },
    },
    'payload.telephone': {
        in: ['body'],
        exists: {
            errorMessage: 'telephone is required',
        },
        isLength: {
            options: {
                min: 9,
                max: 9
            },
        },
        errorMessage: "telephone must be have 9 digits",
        notEmpty: {
            errorMessage: 'telephone can not be empty'
        },
    },
    // 'payload.email': {
    //     in: ['body'],
    //     exists: {
    //         errorMessage: 'email is required',
    //     },
    //     isEmail: true
    // },
    'payload.address': {
        in: ['body'],
        exists: {
            errorMessage: 'address is required',
        },
        notEmpty: {
            errorMessage: 'address can not be empty'
        },
    },
    'payload.address.type_address': {
        in: ['body'],
        exists: {
            errorMessage: 'type_address is required',
        },
        isIn: {
            options: [['POSTAL', 'PHYSICAL', 'BOTH']]
        },
        errorMessage: "type_address is not valid",
        notEmpty: {
            errorMessage: 'type_address can not be empty'
        },
    },
    'payload.address.address_line': {
        in: ['body'],
        exists: {
            errorMessage: 'address_line is required',
        },
        notEmpty: {
            errorMessage: 'address_line can not be empty'
        },
    },
    'payload.address.district': {
        in: ['body'],
        exists: {
            errorMessage: 'district is required',
        },
        notEmpty: {
            errorMessage: 'district can not be empty'
        },
    },
    'payload.address.department': {
        in: ['body'],
        exists: {
            errorMessage: 'department is required',
        },
        notEmpty: {
            errorMessage: 'department can not be empty'
        },
    },
    'payload.address.province': {
        in: ['body'],
        exists: {
            errorMessage: 'province is required',
        },
        notEmpty: {
            errorMessage: 'province can not be empty'
        }
    },
     
}
// END PATIENTS VALIDATOR SCHEMAS

module.exports = {
    CreatePatientValidatorSchema,
    UpdatePatientValidatorSchema
}