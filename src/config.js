const config = require('./config-example.js');
// Example: override private key of config-example.js
config.privateKey = '0x123213243243';
// Export results from config-example.js
module.exports = config;