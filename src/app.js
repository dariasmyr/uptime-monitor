const config = require('./sample-config.json');
const axios = require('axios');

function log(...msg) {
    console.log(new Date().toISOString(), ...msg);
}

async function pingSite(url) {
    try {
        // Download url and check status is 200
        const result = await axios.get(url);
        return (result.status >= 200) && (result.status <= 299);
    } catch (err) {
        log('err', err.message);
        return false;
    }
}

function main() {
    console.log('Starting...');
    const sites = config.sites;
    log('sites', sites);
    for (const site of sites) {
        log(`Start pinging ${site.url} with interval ${site.intervalMs}`);
        setInterval(async function () {
            const pingTimeStart = new Date().getTime();
            const pingResult = await pingSite(site.url);
            const pingTimeEnd = new Date().getTime();
            const pingTime = pingTimeEnd - pingTimeStart;
            log(`Ping ${site.url} result: ${pingResult} in ${pingTime} ms`);
        }, site.intervalMs);
    }
    log('Monitoring sites...');
}

main()