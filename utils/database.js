const Sequelize = require('sequelize');

const sequelize = new Sequelize('todo_nodejs', 'root', '', {
    dialect: 'mysql',
    host :'localhost'
});
module.exports = sequelize;
