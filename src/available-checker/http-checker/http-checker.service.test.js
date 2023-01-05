const {HttpCheckerService} = require('./http-checker.service');

describe('Http checker service', () => {
  test('should check site available via http', async () => {
    const availableResult = await HttpCheckerService.httpCheck('https://google.com');
    expect(availableResult.isAlive).toBeTruthy();
  });
});
