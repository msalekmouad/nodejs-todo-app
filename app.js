const express = require('express');
const app = express();
const _port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');
const csrfProtection = csrf();
//Models
const Todo = require('./models/Todo');
const User = require('./models/User');
const Comment = require('./models/Comment');
//Routes
const todoRoute = require('./routes/todo');
const userRoute = require('./routes/users');
//init session store
var sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'todo_nodejs'
});
//templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
/*app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "thedogsleepsatnight"
}));*/
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
app.use(csrfProtection);
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    next();
});

//rout
app.use(todoRoute);
app.use(userRoute);
//Associations
 Todo.belongsTo(User);
 User.hasMany(Todo);
 Todo.hasMany(Comment);
 Comment.belongsTo(Todo);
 Comment.belongsTo(User);
 User.hasMany(Comment);
 //Database Sync


sequelize
    .sync()
    .then(res=>{
        app.listen(_port,()=>{
            console.log('App starter on http://localhost:'+_port);
        });
    })
    .catch(err => console.log(err));
