class CheckResultsRepository {
  constructor() {
    this.httpCheckResults = new Map();
    this.pingCheckResults = new Map();
    this.sslCheckResults = new Map();
  }

  saveHttp(url, result, message) {
    this.httpCheckResults.set(url, {
      result,
      message
    });
  }

  savePing(host, isAlive, time) {
    this.pingCheckResults.set(host, {
      isAlive,
      time
    });
  }

  saveSsl(host, validTo, validFrom, daysLeft) {
    this.sslCheckResults.set(host, {
      validTo,
      validFrom,
      daysLeft
    });
  }

  getHttpResults() {
    const results = {};
    for (const [url, result] of this.httpCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return results;
  }

  getPingResults() {
    const results = {};
    for (const [host, result] of this.pingCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[host] = result;
    }
    return results;
  }

  getSslResults() {
    const results = {};
    for (const [host, result] of this.sslCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[host] = result;
    }
    return results;
  }
}

module.exports = {
  CheckResultsRepository
};
