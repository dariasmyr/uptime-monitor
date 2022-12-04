const config = require('./config/config.js');
const axios = require('axios');
const {TelegramRepository} = require('./telegram.repository');
const {LoggerService} = require("./logger.service");

async function pingSite(url) {
    // Download url and check status is 200
    const result = await axios.get(url);
    try {
        return (result.status >= 200) && (result.status <= 299);
    } catch (err) {
        return false;
    }
}

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
            try {
                const pingResult = await pingSite(site.url);
                const pingTimeEnd = new Date().getTime();
                const pingTime = pingTimeEnd - pingTimeStart;
                logger.log(`Ping ${site.url} result: ${pingResult} in ${pingTime} ms`);
            } catch (err) {
                const pingResult = false;
                const pingTimeEnd = new Date().getTime();
                const pingTime = pingTimeEnd - pingTimeStart;
                let message = `Ping ${site.url} result: ${pingResult} in ${pingTime} ms. Error: ${err.message}.`;
                logger.log(message);
                await telegramRepository.sendMessage(message);
            }
        }, site.intervalMs);
    }
    logger.log('Monitoring sites...');
}

main()