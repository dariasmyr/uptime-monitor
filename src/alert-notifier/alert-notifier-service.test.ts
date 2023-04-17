import { AlertNotifierService } from './alert-notifier-service';

describe('Alert notifier', () => {
  let alertNotifierService: AlertNotifierService;

  beforeAll(() => {
    alertNotifierService = new AlertNotifierService();
  });

  test('should notify', async () => {
    const result = await alertNotifierService.sendAlertMessage(
      'https://www.youtube.com/',
    );
    console.log(result);
    expect(result).toBeUndefined();
  });
});
