const Sequelize = require('sequelize');

const sequelize = new Sequelize('dbpruebazap', 'root', 'admin', {
  host: 'dbpruebazap',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

sequelize.sync()
  .then(() => console.log('User table has been created, if one does not exist'))
  .catch(error => console.error('This error occured', error));

module.exports = {
  User,
  sequelize
};
