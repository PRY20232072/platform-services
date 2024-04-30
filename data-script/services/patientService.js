const { axiosInstance } = require('./httpCommon');

class PatientService {
  static createPatient(data, token) {
    return axiosInstance.post('/Patient', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

module.exports.PatientService = PatientService;