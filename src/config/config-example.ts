import path from 'node:path';

export const config = {
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
    port: 443,
    sslTimeoutMs: 5000,
    pingTimeout: 10,

    sites: [
        {
            url: 'https://site.com',
            intervalMs: 6000,
            checkMethods: [
                'http',
                'ping',
                'ssl'
            ],
            healthSlug: 'health',
            responseBody: 'OK',
            statusCode: 200
        },
        {
            url: 'http://site2.com',
            intervalMs: 3000,
            checkMethods: [
                'http',
                'ping'
            ],
            healthSlug: 'health',
            responseBody: 'OK',
            statusCode: 200
        }
    ]
};


