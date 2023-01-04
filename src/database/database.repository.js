const {Sequelize, DataTypes, Model, Op} = require('sequelize');
const {LoggerService} = require('../logger/logger.service');
const {stringifyFormatted} = require('../tools/tools');
const logger = new LoggerService('DatabaseRepository');

class DownTimeReport extends Model {}

class DatabaseRepository {
  isInitialized = false;

  constructor(_pathToDatabaseFile) {
    this.pathToDbFile = _pathToDatabaseFile;
  }

  async init() {
    const sequelize = new Sequelize({
      dialect: 'sqlite', storage: this.pathToDbFile
      // logging: (...msg) => console.log(...msg)
    });

    DownTimeReport.init({
      id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
      }, description: {
        type: DataTypes.TEXT, allowNull: false
      }, errorStatus: {
        type: DataTypes.TEXT, allowNull: false
      }, site: {
        type: DataTypes.TEXT, allowNull: false
      }
    }, {
      sequelize, updatedAt: false, createdAt: true, tableName: 'down_time_reports', indexes: [{
        fields: ['id'], unique: true
      }]
    });

    await DownTimeReport.sync({alter: true});
    this.isInitialized = true;
    logger.debug('Database initialized');
  }

  async saveReport({message, result, url}) {
    if (!this.isInitialized) {
      throw new Error('Database is not initialized');
    }
    logger.debug('Saving report with params: ', stringifyFormatted({message, result, url}));
    try {
      const row = await DownTimeReport.create({
        description: message, errorStatus: result.toString(), site: url
      });
      logger.debug('Row added: ', stringifyFormatted(row), 'with id: ', row.id);
      return true;
    } catch (error) {
      logger.error('Error adding row: ', error.message);
      return false;
    }
  }

  // eslint-disable-next-line consistent-return
  async deleteOldRecords(countToKeep) {
    if (!this.isInitialized) {
      throw new Error('Database is not initialized');
    }
    const total = await DownTimeReport.count();
    logger.debug('Total rows:', total);
    if (total > countToKeep) {
      // Find latest countToKeep rows, and delete all others rows
      const rowsToDelete = await DownTimeReport.findAll({
        order: [['id', 'DESC']], offset: countToKeep
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

      const recordsKept = await DownTimeReport.count();
      logger.debug('Deleted rows:', deletedRows);
      return recordsKept;
    } else {
      console.log('No rows deleted');
    }
  }
}

module.exports = {
  DatabaseRepository
};


