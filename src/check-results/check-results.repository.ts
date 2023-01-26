// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
interface checkResultsRaw {
  url: string;
  checkMethods: string[];
  healthIsAlive: boolean;
  healthBody: string;
  httpIsAlive: boolean;
  httpStatusCode: number;
  pingIsAlive: boolean;
  pingTime: number;
  sslIsAlive: boolean;
  sslRemainingDays: number;
}

export class CheckResultsRepository {
  CheckResults: Map<string, any>;
  constructor() {
    this.CheckResults = new Map();
  }

  save(data: checkResultsRaw) {
    this.CheckResults.set(data.url, {
      checkMethods: data.checkMethods,
      healthResults: {
        isAlive: data.healthIsAlive,
        body: data.healthBody,
      },
      httpResults: {
        isAlive: data.httpIsAlive,
        statusCode: data.httpStatusCode,
      },
      pingResults: {
        isAlive: data.pingIsAlive,
        time: data.pingTime,
      },
      sslResults: {
        isAlive: data.sslIsAlive,
        remainingDays: data.sslRemainingDays,
      },
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
