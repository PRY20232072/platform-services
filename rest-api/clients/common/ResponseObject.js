class ResponseObject {
  constructor(data, error = false) {
    this.data = data;
    this.error = error;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

module.exports = {
  ResponseObject
};