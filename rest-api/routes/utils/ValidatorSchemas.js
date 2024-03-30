const {
    CreatePatientValidatorSchema,
    UpdatePatientValidatorSchema
} = require('./PatientValidatorSchemas');

const {
    CreatePractitionerValidatorSchema,
    UpdatePractitionerValidatorSchema
} = require('./PractitionerValidatorSchemas');

const {
    CreateConsentValidatorSchema,
    ApproveConsentValidatorSchema
} = require('./ConsentValidatorSchemas');

const {
    CreateAllergyValidatorSchema,
    UpdateAllergyValidatorSchema
} = require('./AllergyValidatorSchemas');

const {
    CreateFamilyHistoryValidatorSchema,
    UpdateFamilyHistoryValidatorSchema
} = require('./FamilyHistoryValidatorSchemas');

const {
    CreateNotificationValidatorSchema,
    UpdateNotificationValidatorSchema
} = require('./NotificationValidatorSchemas');

module.exports = {
    CreatePatientValidatorSchema: CreatePatientValidatorSchema,
    UpdatePatientValidatorSchema: UpdatePatientValidatorSchema,
    CreatePractitionerValidatorSchema: CreatePractitionerValidatorSchema,
    UpdatePractitionerValidatorSchema: UpdatePractitionerValidatorSchema,
    CreateConsentValidatorSchema: CreateConsentValidatorSchema,
    ApproveConsentValidatorSchema: ApproveConsentValidatorSchema,
    CreateAllergyValidatorSchema: CreateAllergyValidatorSchema,
    UpdateAllergyValidatorSchema: UpdateAllergyValidatorSchema,
    CreateFamilyHistoryValidatorSchema: CreateFamilyHistoryValidatorSchema,
    UpdateFamilyHistoryValidatorSchema: UpdateFamilyHistoryValidatorSchema,
    CreateNotificationValidatorSchema: CreateNotificationValidatorSchema,
    UpdateNotificationValidatorSchema: UpdateNotificationValidatorSchema
}