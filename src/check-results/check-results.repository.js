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

  getResults() {
    const results = {};
    for (const [url, result] of this.httpCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return results;
  }
}

module.exports = {
  CheckResultsRepository
};
