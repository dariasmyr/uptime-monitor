const config = require('./sample-config.json');
const axios = require('axios');

function log(msg) {
    console.log(new Date().toISOString(), msg);
}

// Mock function to ping a site
// Todo - change this function as if you really want to ping a site

async function pingSite(url) {
    try {
        // Download url and check status is 200
        const result = await axios.get(url);
        return result.status === 200;
    } catch (err) {
        log('err', err.message);
        return false;
    }
}

function main() {
    const sites = config.sites;
    log('sites', sites);
    sites.forEach(function (site) {
        log(`Start pinging ${site.url} with interval ${site.intervalMs}`);

        setInterval(async function () {
                const pingTimeStart = new Date().getTime();
                const pingResult = await pingSite(site.url);
                const pingTimeEnd = new Date().getTime();
                const pingTime = pingTimeEnd - pingTimeStart;
                log(`Ping ${site.url} result: ${pingResult} in ${pingTime} ms`);
        }, site.intervalMs);
    });
    log('Monitoring sites...');
}

main()
