const {Sequelize, DataTypes, Model, Op} = require('sequelize');
const {LoggerService} = require("./logger.service");

const logger = new LoggerService('DatabaseRepository');

class DownTimeReport extends Model {
}

class DatabaseRepository {
    constructor(_pathToDbFile) {
        this.pathToDbFile = _pathToDbFile;
    }

    async init() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: this.pathToDbFile,
            // logging: (...msg) => console.log(...msg)
        });

        DownTimeReport.init({
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
            createdAt: true,
            tableName: 'down_time_reports',
            indexes: [
                {
                    fields: ['id'],
                    unique: true
                }
            ]
        });

        await DownTimeReport.sync({alter: true});
        logger.debug('Database initialized');
    }

    async saveReport({message, result, url}) {
        logger.debug('Saving report with params: ', JSON.stringify({message, result, url}, null, 2));
        try {
            const row = await DownTimeReport.create({
                description: message,
                error_status: result.toString(),
                site: url
            });
            logger.debug('Row added: ', JSON.stringify(row, null, 2), 'with id: ', row.id);
        } catch (err) {
            logger.error('Error adding row: ', err.message);
        }
    }

    async deleteOldRecords(countToKeep) {
        const total = await DownTimeReport.count();
        logger.debug('Total rows:', total);
        if (total > countToKeep) {
            // Find latest countToKeep rows, and delete all others rows
            const rowsToDelete = await DownTimeReport.findAll({
                order: [['id', 'DESC']],
                offset: countToKeep
            });

            const idsToDelete = rowsToDelete.map(row => row.id);
            logger.debug('Deleting rows with ids:', idsToDelete);

            const deletedRows = await DownTimeReport.destroy({
                where: {
                    id: {
                        [Op.in]: idsToDelete
                    }
                }
            });

            logger.debug('Deleted rows:', deletedRows);
        } else {
            console.log('No rows deleted');
        }
    }
}

module.exports = {
    DatabaseRepository
}



