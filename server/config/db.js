const Sequelize = require('sequelize');
const sequelize = new Sequelize('mitosis', 'mitosis', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

module.exports = sequelize;

sequelize.authenticate()
  .then(() => console.log('Database is connected'))
  .then(() => sequelize.sync())
  .catch(err => console.error('DB Error: ', err));
