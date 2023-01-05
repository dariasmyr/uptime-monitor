class CheckResultsRepository {
  constructor() {
    this.CheckResults = new Map();
  }

  save(host, checkMethods, httpIsAlive, httpMessage, pingIsAlive, pingTime, sslIsAlive, sslDaysLeft) {
    this.CheckResults.set(host, {
      checkMethods: checkMethods,
      httpResults: {
        isAlive: httpIsAlive,
        message: httpMessage
      },
      pingResults: {
        isAlive: pingIsAlive,
        time: pingTime
      },
      sslResults: {
        isAlive: sslIsAlive,
        daysLeft: sslDaysLeft
      }
    });
  }

  getResults() {
    const results = {};
    for (const [url, result] of this.CheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return results;
  }
}

module.exports = {
  CheckResultsRepository
};
