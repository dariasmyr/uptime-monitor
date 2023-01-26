import { HttpCheckerService } from './http-checker.service';

describe('Http checker service', () => {
  let httpCheckerService: HttpCheckerService;

  beforeAll(() => {
    httpCheckerService = new HttpCheckerService();
  });

  test('should check site available via http', async () => {
    const httpResult = await httpCheckerService.httpCheck('https://google.com');
    expect(httpResult.isAlive).toBeTruthy();
  });
});
