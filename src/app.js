const config = require('./config/config.js');
const {TelegramRepository} = require('./telegram/telegram.repository');
const {LoggerService} = require('./logger/logger.service');
const {DatabaseRepository} = require('./database/database.repository');
const {CheckResultsRepository} = require('./check-results/check-results.repository');
const {stringifyFormatted} = require('./tools/tools');
const {AvailableCheckerService} = require('./available-checker/available-checker.service');
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
      const checkResults = await availableCheckerService.check(site.url, site.checkMethods, config.port, config.sslTimeoutMs);
      logger.debug('Check results', stringifyFormatted(checkResults));

      checkResultsRepository.save(
        site.url,
        site.checkMethods,
        checkResults.httpCheck.isAlive,
        checkResults.httpCheck.message,
        checkResults.pingCheck.isAlive,
        checkResults.pingCheck.timeMs,
        checkResults.sslCheck.isAlive,
        checkResults.sslCheck.daysLeft
      );

      await databaseRepository.saveReport(
        site.url,
        checkResults.httpCheck.isAlive,
        checkResults.httpCheck.message,
        checkResults.pingCheck.isAlive,
        checkResults.pingCheck.timeMs,
        checkResults.sslCheck.isAlive,
        checkResults.sslCheck.daysLeft
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
