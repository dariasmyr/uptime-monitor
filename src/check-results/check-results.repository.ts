export class CheckResultsRepository {
  private CheckResults: Map<any, any>;
  constructor() {
    this.CheckResults = new Map();
  }

  save(host: string, checkMethods: string[], healthIsAlive: boolean, healthBody: string, httpIsAlive: boolean, httpStatusCode: number, pingIsAlive: boolean, pingTime: number, sslIsAlive: boolean, sslRemainingDays: number) {
    this.CheckResults.set(host, {
      checkMethods: checkMethods,
      healthResults: {
        isAlive: healthIsAlive,
        body: healthBody
      },
      httpResults: {
        isAlive: httpIsAlive,
        statusCode: httpStatusCode
      },
      pingResults: {
        isAlive: pingIsAlive,
        time: pingTime
      },
      sslResults: {
        isAlive: sslIsAlive,
        remainingDays: sslRemainingDays
      }
    });
  }

  getResults() {
    const results: any = {};
    for (const [url, result] of this.CheckResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return results;
  }
}
