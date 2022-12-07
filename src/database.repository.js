const {Sequelize, DataTypes} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database.sqlite',
    logging: (...msg) => console.log(msg)
});

Error = sequelize.define('Error', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    error_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    site: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Other model options go here
    sequelize,
    freezeTableName: true,
    timestamps: true
});

class Error extends require('sequelize').Model {
    static async openDB() {
        // Synchronise with database
        try {
            await Error.sync({alter: true});
            logger.log("All models were synchronized successfully.");
        } catch (err) {
            logger.log('Database open error', err.message);
        }
    }

    async addErrorToDatabase(params) {
        logger.log('Adding row with params: ' + params);
        try {
         Error.create = ({date_created: pingTime, description: message, error_status: result, site: site.url})
                logger.log('Row added: ' + params);
            } catch (err) {
                logger.log('Error adding row: ' + err);
            }
    }
}


module.exports = {
    DatabaseRepository
}



