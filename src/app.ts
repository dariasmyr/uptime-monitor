import { AvailableCheckerService } from './available-checker/available-checker.service';
import { CheckResultsRepository } from './check-results/check-results.repository';
import { config } from './config/config';
import { DatabaseRepository } from './database/database.repository';
import { LoggerService } from './logger/logger.service';
import { TelegramRepository } from './telegram/telegram.repository';
import { stringifyFormatted } from './tools/tools';

const logger = new LoggerService('main', true);

// logger.enabled = false;

async function main() {
  const checkResultsRepository = new CheckResultsRepository();

  const telegramRepository = new TelegramRepository(
    checkResultsRepository,
    config.telegram.apiKey,
    config.telegram.chatId,
    config.telegram.dryRun,
  );
  await telegramRepository.sendMessage('Bot started');
  const databaseRepository = new DatabaseRepository();

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
      `Start monitoring "${site.url}" with interval ${site.intervalMs}`,
    );
    setInterval(async () => {
      const availableCheckerService = new AvailableCheckerService();
      const checkResults = await availableCheckerService.check({
        host: site.url,
        methods: site.checkMethods,
        port: config.port,
        timeout: config.sslTimeoutMs,
        healthSlug: site.healthSlug,
        responseBody: site.responseBody,
        statusCode: site.statusCode,
      });
      logger.debug('Check results', stringifyFormatted(checkResults));

      checkResultsRepository.save({
        url: site.url,
        checkMethods: site.checkMethods,
        healthIsAlive: checkResults.healthCheck.isAlive,
        healthBody: checkResults.healthCheck.receivedData.body,
        httpIsAlive: checkResults.httpCheck.isAlive,
        httpStatusCode: checkResults.httpCheck.receivedData.statusCode,
        pingIsAlive: checkResults.pingCheck.isAlive,
        pingTime: checkResults.pingCheck.receivedData.time,
        sslIsAlive: checkResults.sslCheck.isAlive,
        sslRemainingDays: checkResults.sslCheck.receivedData.remainingDays,
      });

      await databaseRepository.saveReport({
        host: site.url,
        healthCheckIsAlive: checkResults.healthCheck.isAlive,
        healthCheckBody: checkResults.healthCheck.receivedData.body,
        httpCheckIsAlive: checkResults.httpCheck.isAlive,
        httpCheckStatusCode: checkResults.httpCheck.receivedData.statusCode,
        pingCheckIsAlive: checkResults.pingCheck.isAlive,
        pingCheckTimeMs: checkResults.pingCheck.receivedData.time,
        sslCheckIsAlive: checkResults.sslCheck.isAlive,
        sslCheckDaysLeft: checkResults.sslCheck.receivedData.remainingDays,
      });

      const checkResolution = await availableCheckerService.makeResolution(
        checkResults,
      );
      logger.debug('Check resolution', stringifyFormatted(checkResolution));
      if (!checkResolution.isAlive) {
        await telegramRepository.sendMessage(
          `Site ${site.url} is DOWN. ${checkResolution.message}`,
        );
      }
    }, site.intervalMs);
  }
  logger.debug('Monitoring sites started...');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
