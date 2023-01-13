const config = require('./config/config.ts');
import {TelegramRepository} from './telegram/telegram.repository';
import {LoggerService} from '@/logger/logger.service';
import {DatabaseRepository} from './database/database.repository';
import {CheckResultsRepository} from './check-results/check-results.repository';
import {stringifyFormatted} from './tools/tools';
import {AvailableCheckerService} from './available-checker/available-checker.service';
const logger = new LoggerService('main', true);

// logger.enabled = false;

async function main() {
  const checkResultsRepository = new CheckResultsRepository();

  const telegramRepository = new TelegramRepository(
    checkResultsRepository,
    config.telegram.apiKey,
    config.telegram.chatId,
    config.telegram.dryRun
  );
  await telegramRepository.sendMessage('Bot started');

  const databaseRepository = new DatabaseRepository(config.db.filePath);
  await databaseRepository.init();

  function startDeleteOldRecordsInterval() {
    setInterval(async () => {
      try {
        await databaseRepository.deleteOldRecords(config.keepLastRecordCount);
        logger.debug('Old records deleted');
      } catch (error) {
        logger.error('Error while deleting old records: ', error);
      }
    }, config.oldRecordsDeleteIntervalMs);
  }

  startDeleteOldRecordsInterval();

  logger.debug('Sites', stringifyFormatted(config.sites));
  for (const site of config.sites) {
    logger.debug(
      `Start monitoring "${site.url}" with interval ${site.intervalMs}`
    );
    setInterval(async () => {

      const availableCheckerService = new AvailableCheckerService();
      const checkResults = await availableCheckerService.check(site.url, site.checkMethods, config.port, config.sslTimeoutMs, site.healthSlug, site.responseBody, site.statusCode);
      logger.debug('Check results', stringifyFormatted(checkResults));

      checkResultsRepository.save(
        site.url,
        site.checkMethods,
        checkResults.healthCheck.isAlive,
        checkResults.healthCheck.receivedData.body,
        checkResults.httpCheck.isAlive,
        checkResults.httpCheck.receivedData.statusCode,
        checkResults.pingCheck.isAlive,
        checkResults.pingCheck.receivedData.time,
        checkResults.sslCheck.isAlive,
        checkResults.sslCheck.receivedData.remainingDays
      );

      await databaseRepository.saveReport(
        site.url,
        checkResults.healthCheck.isAlive,
        checkResults.healthCheck.receivedData.body,
        checkResults.httpCheck.isAlive,
        checkResults.httpCheck.receivedData.statusCode,
        checkResults.pingCheck.isAlive,
        checkResults.pingCheck.receivedData.time,
        checkResults.sslCheck.isAlive,
        checkResults.sslCheck.receivedData.remainingDays
      );

      const checkResolution = await availableCheckerService.makeResolution(checkResults);
      logger.debug('Check resolution', stringifyFormatted(checkResolution));

      if (!checkResolution.isAlive) {
        await telegramRepository.sendMessage(
          `Site ${site.url} is down. ${checkResolution.message}`
        );
      }
    }, site.intervalMs);
  }
  logger.debug('Monitoring sites started...');
}


// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
