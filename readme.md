A simple uptiming monitoring tool to check the workability of sites with error notification

# Get started

1) git clone ...
2) npm install
3) cp src/config/config-example.js and create src/config/config.ts 
4) Edit config.ts in the following way:
    a) Get your way to connect to the config-example.js (const config = require('./config-example.js'))
    b) Override apiKey + chatId + sites of config-example.js with your own values
    c) Export results from config-example.js (module.exports = config)
5) Development run: npm run dev 
6) Production run: npm run start / npm start

## Structure description

Src directory contains the main project files. There is a following structure:
/config - directory with project settings, contains config.js (not in git) and config-example.js (in git)

### package.json scripts

1) start - Production start 
2) dev - Development start (auto restart on code changed)
