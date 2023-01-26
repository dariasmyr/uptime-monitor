import { CheckResultsRepository } from '../check-results/check-results.repository';
import { config } from '../config/config';
import { TelegramRepository } from './telegram.repository';

describe('Telegram repository', () => {
  test('should send message', async () => {
    const telegramRepository = new TelegramRepository(
      new CheckResultsRepository(),
      config.telegram.apiKey,
      config.telegram.chatId,
      config.telegram.dryRun,
    );
    const result = await telegramRepository.sendMessage('Test message');
    expect(result).toBeTruthy();
  });
});
