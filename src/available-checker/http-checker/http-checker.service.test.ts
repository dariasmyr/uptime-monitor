const {HttpCheckerService} = require('./http-checker.service');

describe('Http checker service', () => {
  let httpCheckerService: { httpCheck: (arg0: string, arg1: string, arg2: string, arg3: number) => any; };

  beforeAll(() => {
    httpCheckerService = new HttpCheckerService();
  });

  test('should check site available via http', async () => {
    const httpResult = await httpCheckerService.httpCheck('https://google.com', 'health', 'OK', 200);
    expect(httpResult.isAlive).toBeTruthy();
  });
});
