const {Sequelize, DataTypes, Model, Op} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database.sqlite',
    // logging: (...msg) => console.log(...msg)
});

class ErrorRecord extends Model {
}

ErrorRecord.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    error_status: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    site: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    updatedAt: false,
    createdAt: 'date_created',
    modelName: 'error_record',
    indexes: [{unique: true, fields: ['id']}]
});

class DatabaseRepository {
    async openDB() {
        await ErrorRecord.sync({alter: true});
        logger.log('Database opened');
    }


    async addErrorToDatabase(params) {
        const {message, result, url} = params;
        logger.log('Adding row with params: ', JSON.stringify(params));
        try {
            const row = await ErrorRecord.create({
                description: message,
                error_status: result.toString(),
                site: url
            });
            logger.log('Row added: ', JSON.stringify(row));
            logger.log(row instanceof ErrorRecord); // true
            logger.log(row.id);// 1
        } catch (err) {
            logger.log('Error adding row: ' + err);
        }
    }


    async deleteOldRecords(countToKeep) {
        const total = await ErrorRecord.count();
        logger.log('Total rows:', total);
        if (total > countToKeep) {
            // Find latest countToKeep rows, and delete all others rows

            const rowsToDelete = await ErrorRecord.findAll({
                order: [['id', 'DESC']],
                offset: countToKeep
            });

            const idsToDelete = rowsToDelete.map(row => row.id);
            logger.log('Deleting rows with ids: ', idsToDelete);

            const deletedRows = await ErrorRecord.destroy({
                where: {
                    id: {
                        [Op.in]: idsToDelete
                    }
                }
            });

            logger.log('Deleted rows: ', deletedRows);
        }
        else {
            console.log('No rows deleted');
        }
    }
}

module.exports = {
    DatabaseRepository
}



