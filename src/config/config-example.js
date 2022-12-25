const path = require('node:path');

const config = {
  db: {
    filePath: path.join(__dirname, '..', '..', 'data', 'db.sqlite3')
  },
  telegram: {
    apiKey: '0000000000:00000000000000000000000000000000000',
    chatId: '0000000',
    dryRun: false
  },
  keepLastRecordCount: 100,
  oldRecordsDeleteIntervalMs: 10_000,
  sites: [
    {
      url: 'https://site.com',
      intervalMs: 6000
    },
    {
      url: 'http://site2.com',
      intervalMs: 3000
    }
  ]
};

module.exports = config;


