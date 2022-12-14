const config = require('./config/config.js');
const {TelegramRepository} = require('./telegram.repository');
const {LoggerService} = require("./logger.service");
const {AvailableCheckerService} = require('./available-checker.service');
const {DatabaseRepository} = require('./database.repository');
const logger = new LoggerService('main', true);

async function main() {
    // logger.enabled = false;

    const telegramRepository = new TelegramRepository(config.telegram.apiKey, config.telegram.chatId, config.telegram.dryRun);
    await telegramRepository.sendMessage('Bot started');

    const databaseRepository = new DatabaseRepository(config.db.filePath);
    await databaseRepository.init();

    function startDeleteOldRecordsInterval() {
        setInterval(async function () {
            try {
                await databaseRepository.deleteOldRecords();
                logger.debug('Old records deleted');
            } catch (err) {
                logger.error('Error while deleting old records: ', err);
            }
        }, config.oldRecordsDeleteIntervalMs);
    }

    startDeleteOldRecordsInterval();

    logger.debug('Sites', JSON.stringify(config.sites, null, 2));
    for (const site of config.sites) {
        logger.debug(`Start monitoring "${site.url}" with interval ${site.intervalMs}`);
        setInterval(async function () {
            const {result, message} = await AvailableCheckerService.isSiteAvailableViaHttp(site.url);
            logger.debug(`Result for "${site.url}": ${result}, message: ${message}`);
            if (!result) {
                await databaseRepository.saveReport({
                    message,
                    result,
                    url: site.url
                });

                await telegramRepository.sendMessage(`Site ${site.url} is not available. ${message}`);
            }
        }, site.intervalMs);
    }
    logger.debug('Monitoring sites started...');
}

// main().catch(console.error);
