const config = require('./config/config.js');
const axios = require('axios');
const chalk = require('chalk');


async function sendMessageToTelegram (message) {
    const apiKey = config.apiKey;
    const chatId = config.chatId;
    const url = `https://api.telegram.org/bot${apiKey}/sendMessage?chat_id=${chatId}&text=${message}`;
    return await axios.get(url);
}

function log(...msg) {
    console.log(chalk.bgCyanBright(new Date().toISOString()), '|', chalk.magenta(...msg));
}

async function pingSite(url) {
    // Download url and check status is 200
    const result = await axios.get(url);
    try {
    return (result.status >= 200) && (result.status <= 299);
    } catch (err) {
    return false;
    }
}

function main() {
    console.log('Starting...');
    const sites = config.sites;
    log('sites', JSON.stringify(sites, null, 2));
    for (const site of sites) {
        log(`Start pinging ${site.url} with interval ${site.intervalMs}`);
        setInterval(async function () {
            const pingTimeStart = new Date().getTime();
            try {
                const pingResult = await pingSite(site.url);
                const pingTimeEnd = new Date().getTime();
                const pingTime = pingTimeEnd - pingTimeStart;
                log(`Ping ${site.url} result: ${pingResult} in ${pingTime} ms`);
            } catch (err) {
                const pingResult = false;
                const pingTimeEnd = new Date().getTime();
                const pingTime = pingTimeEnd - pingTimeStart;
                let message = `Ping ${site.url} result: ${pingResult} in ${pingTime} ms. Error: ${err.message}`;
                log(message);
                await sendMessageToTelegram(message);
            }
        }, site.intervalMs);
    }
    log('Monitoring sites...');
}

main()