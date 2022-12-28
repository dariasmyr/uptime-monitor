const {TelegramRepository} = require('./telegram.repository');
const {CheckResultsRepository} = require('../check-results/check-results.repository');
const config = require('../config/config');

describe('Telegram repository', () => {
  test('should send message', async () => {
    const checkResultsRepository = new CheckResultsRepository();
    const telegramRepository = new TelegramRepository(
      checkResultsRepository,
      config.telegram.apiKey,
      config.telegram.chatId,
      config.telegram.dryRun
    );
    const result = await telegramRepository.sendMessage('Test message');
    expect(result).toBeTruthy();
  });
});
