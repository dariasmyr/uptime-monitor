const {Sequelize, DataTypes, Model} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database.sqlite',
    logging: (...msg) => console.log(...msg)
});

// create the model ErrorRecord with fields:
// id: int primary key
// date_created: date
// description: text
// error_status: int
// site: text

class ErrorRecord extends Model {
}

ErrorRecord.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_created: {
        type: DataTypes.DATE,
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
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    updatedAt: false,
    modelName: 'error_record',
    indexes: [{ unique: true, fields: ['id'] }]
});

class DatabaseRepository {
    async openDB() {
        await ErrorRecord.sync({alter: true});
        logger.log('Database opened');
    }


    async addErrorToDatabase(params) {
        const {pingTime, message, result, url} = params;
        logger.log('Adding row with params: ', JSON.stringify(params));
        try {
            const row = await ErrorRecord.create ({
                date_created: pingTime,
                description: message,
                error_status: result,
                site: url
            });
            logger.log('Row added: ' , JSON.stringify(row));
            logger.log(row instanceof ErrorRecord); // true
            logger.log(row.id);// 1
        } catch (err) {
            logger.log('Error adding row: ' + err);
        }
    }

}


module.exports = {
    DatabaseRepository
}



