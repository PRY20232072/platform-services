const { axiosInstance } = require('./httpCommon');

class ConsentService {
  static createConsent(data, token) {
    return axiosInstance.post('/Consent', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

module.exports.ConsentService = ConsentService;