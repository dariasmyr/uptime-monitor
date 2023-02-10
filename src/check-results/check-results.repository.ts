interface ICheckResultsRaw {
  url: string;
  checkMethods: string[];
  healthIsAlive: boolean;
  healthBody: string;
  httpIsAlive: boolean;
  httpStatusCode: number | null;
  pingIsAlive: boolean;
  pingTime: number;
  sslIsAlive: boolean;
  sslRemainingDays: number;
}

export class CheckResultsRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkResults: Map<string, any>;
  constructor() {
    this.checkResults = new Map();
  }

  save(data: ICheckResultsRaw): void {
    this.checkResults.set(data.url, {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = {};
    for (const [url, result] of this.checkResults.entries()) {
      // eslint-disable-next-line security/detect-object-injection
      results[url] = result;
    }
    return results;
  }
}
