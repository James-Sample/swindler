const Sequelize = require('sequelize');

const sequelize = new Sequelize('swindles', 'my-db-user', 'db-p$ss', {
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

module.exports = sequelize;
