const config = require('./config/config.js');
const {TelegramRepository} = require('./telegram/telegram.repository');
const {LoggerService} = require('./logger.service/logger.service');
const {AvailableCheckerService} = require('./available-checker/available-checker.service');
const {DatabaseRepository} = require('./database/database.repository');
const {CheckResultsRepository} = require('./check-results/check-results.repository');
const {stringify} = require('./tools/tools');
const logger = new LoggerService('main', true);
const {PingService} = require('./ping/ping.service');
const {SslCertificateCheckService} = require('./ssl-checker/ssl.certificate.check.service.js');

const sslCertificateCheckService = new SslCertificateCheckService();

// eslint-disable-next-line unicorn/prefer-top-level-await,promise/catch-or-return
sslCertificateCheckService.getSiteCertificate('medium.com').then(r => console.log(r));


async function main() {
  // logger.enabled = false;

  const pingService = new PingService();
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
      logger.debug(`[IS SITE AVAILABLE CHECK] Result for "${site.url}": ${result}, message: ${message}`);
      checkResultsRepository.saveHttp(site.url, result, message);
      const siteHost = new URL(site.url).host;
      const {isAlive, time} =
        await pingService.ping(siteHost);
      logger.debug(time > 0 ? `[PING CHECK] Result for host ${siteHost} : is alive. Time: ${time} ms` : `[PING CHECK] Result for host + ${siteHost} : is dead.`);
      checkResultsRepository.savePing(siteHost, isAlive, time);
      if (!result) {
        await databaseRepository.saveReport({
          message,
          result,
          url: site.url
        });

        await telegramRepository.sendMessage(
          `Site ${site.url} is not available. ${message}`
        );
      }
    }, site.intervalMs);
  }
  logger.debug('Monitoring sites started...');
}


// eslint-disable-next-line unicorn/prefer-top-level-await
// main().catch(console.error);
