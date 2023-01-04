class CheckResultsRepository {
  constructor() {
    // todo migrate to single map
    this.httpCheckResults = new Map();
    this.pingCheckResults = new Map();
    this.sslCheckResults = new Map();
  }

  saveHttp(host, isAlive, message) {
    this.httpCheckResults.set(host, {
      isAlive,
      message
    });
  }

  savePing(host, isAlive, time) {
    this.pingCheckResults.set(host, {
      isAlive,
      time
    });
  }

  saveSsl(host, daysLeft) {
    this.sslCheckResults.set(host, daysLeft);
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
    for (const [host, daysLeft] of this.sslCheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[host] = daysLeft > 0 ? `Host ${host} is active. Certificate will expire in ${daysLeft} days.` : `Certificate for host ${host} is expired or doesn't exist. Error: ${daysLeft}`;
    }
    return results;
  }
}

module.exports = {
  CheckResultsRepository
};
