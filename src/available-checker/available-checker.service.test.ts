const {AvailableCheckerService} = require('./available-checker.service');

describe('Available checker service', () => {
  let availableCheckerService;

  beforeAll(() => {
    availableCheckerService = new AvailableCheckerService();
  });

  test('should check site available', async () => {
    // eslint-disable-next-line no-magic-numbers
    const result = await availableCheckerService.check('https://google.com', ['ping', 'ssl'], 443, 10_000);
    console.log(result);
    expect(result).toBeDefined();
  });
});
