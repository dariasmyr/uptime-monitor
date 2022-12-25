const {stringify} = require('./tools');

class CheckResultsRepository {
  constructor() {
    this.httpCheckResults = new Map();
  }

  save(url, result, message) {
    this.httpCheckResults.set(url, {
      result,
      message
    });
  }

  getResultsAsJson() {
    const results = {};
    for (const [url, result] of this.httpCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return stringify(results);
  }
}

module.exports = {
  CheckResultsRepository
};
