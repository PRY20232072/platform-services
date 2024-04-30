const { 
  AllergyService,
  ConsentService,
  FamilyService,
  PatientService,
  PractitionerService
} = require('./services');

const allergyData = require('./data/allergy-data.json');
const familyData = require('./data/family-data.json');
const patientData = require('./data/patient-data.json');
const practitionerData = require('./data/practitioner-data.json');
const consentData = require('./data/consent-data.json');

// PASOS PARA LLENAR LA PLATAFORMA DE DATOS
// 1. Crear un paciente
// 2. Crear un médico
// 3. Médico crea registros de alergias
// 4. Médico crea registros de antecedentes familiares
// 5. Médico crea un consentimiento de alergia y registro familiar

const PATIENT_TOKEN = '<PATIENT_TOKEN>';
const PRACTITIONER_TOKEN = '<PRACTITIONER_TOKEN>';

async function main() {
  console.log('Starting data script...');

  // 1. Crear un paciente
  for (let patient of patientData) {
    try {
      await PatientService.createPatient(patient, PATIENT_TOKEN)
      console.log('Patient created: ', patient.identifier);
    } catch (error) {
      console.error('Error creating patient: ', error);
    }
  }

  // 2. Crear un médico
  for (let practitioner of practitionerData) {
    try {
      await PractitionerService.createPatient(practitioner, PRACTITIONER_TOKEN);
      console.log('Practitioner created: ', practitioner.identifier);
    } catch (error) {
      console.error('Error creating practitioner: ', error);
    }
  }

  // 3. Médico crea registros de alergias
  for (let allergy of allergyData) {
    try {
      await AllergyService.createAllergyRecord(allergy, PRACTITIONER_TOKEN);
      console.log('Allergy created: ', allergy.identifier);
    } catch (error) {
      console.error('Error creating allergy: ', error);
    }
  }

  // 4. Médico crea registros de antecedentes familiares
  for (let family of familyData) {
    try {
      await FamilyService.createFamilyRecord(family, PRACTITIONER_TOKEN);
      console.log('Family created: ', family.identifier);
    } catch (error) {
      console.error('Error creating family: ', error);
    }
  }

  // 5. Médico crea un consentimiento de alergia
  for (let consent of consentData) {
    try {
      await ConsentService.createConsent(consent, PRACTITIONER_TOKEN);
      console.log('Consent created: ', consent.identifier);
    } catch (error) {
      console.error('Error creating consent: ', error);
    }
  }
}

main();