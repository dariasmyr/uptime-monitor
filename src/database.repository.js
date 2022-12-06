const {Sequelize} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

class DatabaseRepository {
    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'src/database.sqlite',
            logging: (...msg) => console.log(msg)
        });
    }

    Error = sequelize.define('Error', {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date_created: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        error_status: {
            type: DataTypes.INT,
            allowNull: false
        },
        site: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        // Other model options go here
    });

    async openDb() {
        try {
            await this.sequelize.authenticate();
            logger.log('Database opened');
        } catch (err) {
            logger.log('Database open error', err.message);
        }
    }


    async addErrorToDatabase(params) {
        logger.log('Params: ' + params);
        let sql = ('INSERT INTO errors(date_created, description, error_status, site) VALUES (?), (?), (?), (?)');
        logger.log('SQLquery: ' + sql);

        logger.log('Insert new row to database...');
        this.db.run(sql, params, function (err) {
            if (err) {
                return console.error('Could not insert new row to database. Error: ' + err.message);
            }
            logger.log(`Rows inserted ${this.changes}`);
        });

    }


    // close DB
    async closeDb() {
        try {
            await this.sequelize.close();
            logger.log('Database closed');
        } catch (err) {
            logger.log('Database close error', err.message);
        }
    }
}

module.exports = {
    DatabaseRepository
}



