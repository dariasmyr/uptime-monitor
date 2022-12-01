const config = require('./sample-config.json');

async function pingSite(url) {
    // wait random time between 0 and 1 second
    const randomDelay = Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    console.log(`Pinged ${url}, time taken: ${randomDelay}ms`);
}

async function pingSites() {
    const sites = config.sites;
    for (const site of sites) {
        console.log(`Pinging ${site.url}`);
        pingSite(site.url);
    }
}

// pingSites();



function fetchUrl () {
    let urls = [
        'https://api.github.com/users/iliakan',
        'https://api.github.com/users/remy',
        'https://no-such-url'
    ];

    Promise.allSettled(urls.map(url => fetch(url)))
        .then(results => { // (*)
            results.forEach((result, num) => {
                if (result.status === "fulfilled") {
                    console.log(`${urls[num]}: ${result.value.status}`);
                }
                if (result.status === "rejected") {
                    console.log(`${urls[num]}: ${result.reason}`);
                }
            });
        });
}

fetchUrl();