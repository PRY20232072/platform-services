const { axiosInstance } = require('./httpCommon');

class FamilyService {
  static createFamilyRecord(data, token) {
    return axiosInstance.post('/FamilyHistory', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

module.exports.FamilyService = FamilyService;