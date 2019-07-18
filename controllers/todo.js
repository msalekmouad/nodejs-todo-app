//import the model
const Todo = require('../models/Todo');
const User = require('../models/User');
exports.getTodo = (req,res,next)=>{
    Todo.findAll({
        include: {
            model : User
        }
    })
        .then(Todos=>{
          //res.send(Todos);
            res.render('todo_list',{
                pageTitle : 'Posts',
                posts : Todos,
                pathUrl:'/',
                isAuthenticated : req.session.userAuth,
                user : req.session.user
            });
        })
    .catch(err => console.log(err));
};

exports.addTodo =(req,res,next)=>{
    const title = req.body.title;
    const text = req.body.text;
    const icon = req.body.icon;

    req.session.user.createTodo({
        todo_title: title,
        todo_text: text,
        todo_icon : icon
    })
    .then(response =>{
        res.redirect('/home');
    }).catch(err =>console.log(err));
};
exports.deleteTodo =(req,res,next)=>{
    const todo_id = req.params.id;
    Todo.findByPk(todo_id)
        .then(todo =>{
            return todo.destroy();
        })
        .then(response =>{
            res.redirect('/home');
        })
        .catch(err=> console.log(err));
};
exports.editTodo =(req,res,next)=>{
    const todo_id = req.params.id;
    Todo.findByPk(todo_id)
        .then(todo =>{
            res.render('edit_todo',{
                pageTitle : todo.todo_title,
                product : todo,
                pathUrl:'/edit_todo',
                isAuthenticated : req.session.userAuth,
                user : req.session.user
            });
        })
        .catch(err => console.log(err));
};
exports.postEditTodo = (req,res,next)=>{
    const todo_id = req.params.id;
    const _title = req.body.todo_title;
    const _text = req.body.todo_text;
    const _icon = req.body.todo_icon;
    Todo.findByPk(todo_id)
        .then(todo =>{
            todo.todo_title = _title;
            todo.todo_text = _text;
            todo.todo_icon  = _icon;
            return todo.save();
        })
        .then(response =>{
            console.log(response);
            res.redirect('/home');
        })
        .catch(err=> console.log(err));
};
exports.getMyPost= (req,res,next)=>{
    // res.send(Object.keys(req.session.user.__proto__));
    //res.send(req.session.user);
    req.session.user.getTodos()
        .then( posts =>{
            res.render('my_posts',{
                pageTitle : 'My posts',
                pathUrl :'/my_posts',
                posts :posts,
                isAuthenticated : req.session.userAuth,
                user : req.session.user
            });
            }
        )
        .catch(err => console.log(err));
};
exports.getPost = (req,res,next)=>{
    const todo_id = req.params.id;
    Todo.findByPk(todo_id)
        .then(post =>{
            User.findByPk(post.userId)
                .then(user=>{
                    post.getComments({
                        include: {
                            model : User
                        }
                    })
                        .then( comments =>{
                            res.render('post',{
                                pageTitle : post.todo_title,
                                pathUrl : '///',
                                postData : post,
                                userData : user,
                                commentsData :comments,
                                isAuthenticated : req.session.userAuth,
                                user : req.session.user
                            });
                        })
                        .catch(err=>console.log(err));
                })
                .catch(err=>console.log(err));

        })
        .catch(err =>console.log(err));
};
exports.postComment= (req,res,next)=>{
    const post_id = req.params.id;
    const comment_text = req.body.comment_message;
    req.session.user.createComment({
        todoTodoId : post_id,
        comment_text : comment_text
    })
        .then(response=>{
            res.redirect('/post/'+post_id);
        })
        .catch(err => console.log(err));
    //res.send(Object.keys(req.user.__proto__));
};
