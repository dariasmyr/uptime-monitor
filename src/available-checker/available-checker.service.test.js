const {AvailableCheckerService} = require('./available-checker.service');

describe('Available checker service', () => {
  test('should check site available via http', async () => {
    const availableResult = await AvailableCheckerService.isSiteAvailableViaHttp('https://google.com');
    expect(availableResult.result).toBeTruthy();
  });
});
