const { axiosInstance } = require('./httpCommon');

class PractitionerService {
  static createPatient(data, token) {
    return axiosInstance.post('/Practitioner', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

module.exports.PractitionerService = PractitionerService;