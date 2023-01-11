const {TelegramRepository} = require('./telegram.repository');
const {CheckResultsRepository} = require('../check-results/check-results.repository');
const config = require('../config/config');

describe('Telegram repository', () => {
  test('should send message', async () => {
    const telegramRepository = new TelegramRepository(
      new CheckResultsRepository(),
      config.telegram.apiKey,
      config.telegram.chatId,
      config.telegram.dryRun
    );
    const result = await telegramRepository.sendMessage('Test message');
    expect(result).toBeTruthy();
  });
});
