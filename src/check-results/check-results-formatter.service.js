const CheckResultsFormatterService = {
  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  formatResults(httpResults, pingResults, sslResults) {

    const results = new Map();

    for (const [host, result] of Object.entries(httpResults)) {
      results.set(host, {
        httpResults: result
      });
    }

    for (const [host, result] of Object.entries(pingResults)) {
      if (results.has(host)) {
        results.get(host).pingResults = result;
      } else {
        results.set(host, {
          pingResults: result
        });
      }
    }

    for (const [host, result] of Object.entries(sslResults)) {
      if (results.has(host)) {
        results.get(host).sslResults = result;
      } else {
        results.set(host, {
          sslResults: result
        });
      }
    }

    // Prettify results

    let formattedResults = '';

    for (const [host, result] of results.entries()) {
      formattedResults += `Host: ${host}\n`;
      if (result.httpResults) {
        formattedResults += `HTTP: ${result.httpResults.isAlive ? 'OK' : 'FAIL'} (${result.httpResults.message})\n`;
      }

      if (result.pingResults) {
        formattedResults += `Ping: ${result.pingResults.isAlive ? 'OK' : 'FAIL'} (${result.pingResults.time} ms)\n`;
      }

      if (result.sslResults) {
        formattedResults += `SSL: ${result.sslResults}\n`;
      }

      formattedResults += '\n-------\n';
    }

    formattedResults = formattedResults.trim();

    return formattedResults;
  }
};

module.exports = {
  CheckResultsFormatterService
};
