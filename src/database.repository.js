const {Sequelize, DataTypes, Model} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database.sqlite',
    logging: (...msg) => console.log(msg),
    createdAt: false
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
    modelName: 'error_record'
});

class DatabaseRepository {
     async openDB() {
        await ErrorRecord.sync({alter: true});
        logger.log('Database opened');
    }

    async addErrorToDatabase(params) {
        logger.log('Adding row with params: ' + params);
        try {
            const row = DatabaseRepository.create = ({
                date_created: pingTime,
                description: message,
                error_status: result,
                site: site.url
            })
            logger.log('Row added: ' + params)
            console.log(row instanceof Error); // true
            console.log(row.name);
        } catch (err) {
            logger.log('Error adding row: ' + err);
        }
    }
}


module.exports = {
    DatabaseRepository
}



