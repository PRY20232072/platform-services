const { axiosInstance } = require('./httpCommon');

class AllergyService {
  static createAllergyRecord(data, token) {
    return axiosInstance.post('/AllergyIntolerance', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

module.exports.AllergyService = AllergyService;