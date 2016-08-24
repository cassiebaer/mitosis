const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Usage = sequelize.define('usage', {
  email: { type: Sequelize.STRING, required: true },
  compileCount: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  compileLimit: {
    type: Sequelize.INTEGER,
    defaultValue: 500,

  },
});

module.exports = Usage;
