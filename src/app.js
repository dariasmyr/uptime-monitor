const config = require('./config/config.js');
const {TelegramRepository} = require('./telegram.repository');
const {LoggerService} = require('./logger.service');
const {AvailableCheckerService} = require('./available-checker.service');
const {DatabaseRepository} = require('./database.repository');
const {CheckResultsRepository} = require('./check-results.repository');
const {stringify} = require('./tools');
const logger = new LoggerService('main', true);

async function main() {
  // logger.enabled = false;

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

  logger.debug('Sites', stringify(config.sites));
  for (const site of config.sites) {
    logger.debug(
      `Start monitoring "${site.url}" with interval ${site.intervalMs}`
    );
    setInterval(async () => {
      const {result, message} =
        await AvailableCheckerService.isSiteAvailableViaHttp(site.url);
      checkResultsRepository.save(site.url, result, message);
      logger.debug(`Result for "${site.url}": ${result}, message: ${message}`);
      if (!result) {
        await databaseRepository.saveReport({
          message,
          result,
          url: site.url
        });

        await telegramRepository.sendMessage(
          `Site ${site.url} is not available. ${message}`
        );
        checkResultsRepository.getResultsAsJson();
      }
    }, site.intervalMs);
  }
  logger.debug('Monitoring sites started...');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
