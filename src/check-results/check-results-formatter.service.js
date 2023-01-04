const CheckResultsFormatterService = {
  // eslint-disable-next-line sonarjs/cognitive-complexity,complexity
  formatResults(httpResults, pingResults, sslResults) {
    /*
 Examples:
 HTTP results:
        {
  "http://stage.gyde.one/": {
    "isAlive": false,
    "message": "getaddrinfo ENOTFOUND stage.gyde.one"
  },
  "https://gyde.one/": {
    "isAlive": true,
    "message": "HTTP status 200"
  },
  "https://www.imdb.com/title/tt0137523/": {
    "isAlive": false,
    "message": "Request failed with status code 403"
  }
}

        Ping results:
        {
  "stage.gyde.one": {
    "isAlive": false,
    "time": -1
  },
  "gyde.one": {
    "isAlive": true,
    "time": 83
  },
  "www.imdb.com": {
    "isAlive": true,
    "time": 53
  }
}

        SSL results:
        {
  "stage.gyde.one": "Certificate for host stage.gyde.one is expired or doesn't exist. Error: ENOTFOUND",
  "gyde.one": "Host gyde.one is active. Certificate will expire in 594625748112 days.",
  "www.imdb.com": "Host www.imdb.com is active. Certificate will expire in 2143358967139 days."
}
         */

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
