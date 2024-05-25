class PatientHelper {
    transformPatientList(patientList) {
        patientList.data = patientList.data.map((patient) => {
            return {
                patient_id: patient.patient_id,
                name_id: patient.name_id,
                telephone: patient.telephone,
                dni: patient.dni,
            }
        });

        return patientList;
    }
}

module.exports.PatientHelper = PatientHelper;