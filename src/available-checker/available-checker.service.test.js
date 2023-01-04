const {AvailableCheckerService} = require('./available-checker.service');

describe('Available checker service', () => {
  test('should return success result', async () => {
    const result = await AvailableCheckerService.isSiteAvailableViaHttp('https://google.com');
    const expected = {
      result: true,
      message: 'HTTP status 200'
    };
    expect(result).toMatchObject(expected);
  });
});
