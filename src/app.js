const config = require('./sample-config.json');

function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
// Mock function to ping a site
// Todo - change this function as if you really want to ping a site

async function pingSite(url) {
    // wait random time between 0 and 1 second
    const randomDelay = Math.random() * 5000;
    await delay(randomDelay);
    console.log(`Pinged ${url}, time taken: ${randomDelay}ms`);
    const randomValue = Math.random();
    if (randomValue >= 0.5) {
        throw new Error('Ping failed');
    } else {
        return true;
    }
}

function main() {
    const sites = config.sites;
    console.log('sites', sites);
    sites.forEach(function (site) {
        console.log(`Start pinging ${site.url} with interval ${site.intervalMs}`);

        setInterval(async function () {
            try {
                const pingResult = await pingSite(site.url);
                console.log('pingResult', pingResult);
            } catch (err) {
                console.log('err', err);
            }
        }, site.intervalMs);
    });
    console.log('Monitoring sites...');
}

main()
