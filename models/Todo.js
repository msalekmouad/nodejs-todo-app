const Sequelize = require('sequelize');
 const sequelize = require('../utils/database');
 const Todo = sequelize.define('todo',{
    todo_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement :true
    } ,
     todo_title : {
        type: Sequelize.STRING,
         allowNull:false
     },
     todo_text : {
         type: Sequelize.STRING,
         allowNull:false
     },
     todo_icon :{
        type : Sequelize.STRING(500)
     }
 });
 module.exports = Todo;
