const config = require('./config/config.js');
const {TelegramRepository} = require('./telegram.repository');
const {LoggerService} = require("./logger.service");
const {AvailableCheckerService} = require('./available-checker.service');

async function main() {
    const telegramRepository = new TelegramRepository(config.apiKey, config.chatId);
    await telegramRepository.sendMessage('Bot started');

    const logger = new LoggerService('main', true);
    // logger.enabled = false;

    const sites = config.sites;
    logger.log('sites', JSON.stringify(sites, null, 2));
    for (const site of sites) {
        logger.log(`Start pinging ${site.url} with interval ${site.intervalMs}`);
        setInterval(async function () {
            const pingTimeStart = new Date().getTime();
            const pingResult = (await AvailableCheckerService.httpCheck(site.url)).result;
            const pingMessage = (await AvailableCheckerService.httpCheck(site.url)).message;
            const pingTimeEnd = new Date().getTime();
            const pingTime = pingTimeEnd - pingTimeStart;
            logger.log(`Ping ${site.url} result: ${pingResult} in ${pingTime} ms`);
            if (!pingResult) {
                await telegramRepository.sendMessage(`Site ${site.url} is not available. ${pingMessage}`);
            }
        }, site.intervalMs);
    }
    logger.log('Monitoring sites...');
}

main().catch(console.error);