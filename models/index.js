const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, {
  host: config.sql.server,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      enableArithAbort: true
    }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;