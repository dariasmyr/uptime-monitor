const CheckResultsFormatterService = {
  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  formatResults(checkResults) {

    let formattedResults = '';
    for (const [url, result] of Object.entries(checkResults)) {
      formattedResults += '\n-------\n';
      formattedResults += `Host: ${url}\n`;
      formattedResults += result.checkMethods.includes('http') ? `HTTP: ${result.httpResults.isAlive ? 'OK' : 'FAIL'} (${result.httpResults.message})\n` : 'HTTP: disabled\n';
      formattedResults += result.checkMethods.includes('ping') ? `Ping: ${result.pingResults.isAlive ? 'OK' : 'FAIL'} (${result.pingResults.time} ms)\n` : 'Ping: disabled\n';
      formattedResults += result.checkMethods.includes('ssl') ? `SSL: ${result.sslResults.isAlive ? 'OK' : 'FAIL'} (Certificate will expire in ${result.sslResults.daysLeft} days)` : 'SSL: disabled';
    }

    formattedResults = formattedResults.trim();

    return formattedResults;
  }
};

module.exports = {
  CheckResultsFormatterService
};
