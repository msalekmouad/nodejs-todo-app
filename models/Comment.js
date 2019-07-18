const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Comment = sequelize.define('Comment',{
    comment_id :{
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    comment_text :{
        type: Sequelize.STRING(500),
        allowNull: false
    }
});

module.exports = Comment;
