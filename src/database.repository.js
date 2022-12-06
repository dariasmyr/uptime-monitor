const sqlite3 = require('sqlite3');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

class DatabaseRepository {
    constructor(_db) {
        this.db = _db;
        this.logger = new LoggerService('DatabaseRepository');
    }

    async openDb() {
        try {
            this.db = new sqlite3.Database(this.db);
            this.logger.log('Database opened');
        } catch (err) {
            this.logger.log('Database open error', err.message);
        }
    }

    async addErrorToDatabase() {
        let params = [this.logger.showTimestamp, main.message, main.status, httpRes.status, url];
        this.logger.log(params);
        let placeholders = params.map(() => '(?)').join(',');
        let sql = ('INSERT INTO errors(date_created, description, error_status, site) VALUES ' + placeholders);
        this.logger.log(sql);

        this.db.run(sql, params, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Rows inserted ${this.changes}`);
        });

    }


    // close DB
    async closeDb(db) {
        try {
            await db.close();
            logger.log('Database closed');
        } catch (err) {
            logger.log('Database close error', err.message);
        }
    }
}

module.exports = {
    DatabaseRepository
}



