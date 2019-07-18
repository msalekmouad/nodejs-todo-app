const express = require("express");
const router = express.Router();
//import the controller
const todoController = require('../controllers/todo');
//set Routes
//middleware
const isAuth = require('../middleware/is-auth');

router.get('/home',isAuth,todoController.getTodo);
router.post('/home',isAuth,todoController.addTodo);
router.get('/home/delete/:id',isAuth,todoController.deleteTodo);
router.get('/home/edit/:id',isAuth,todoController.editTodo);
router.post('/home/edit/:id',isAuth,todoController.postEditTodo);
router.get('/my_posts',isAuth,todoController.getMyPost);
router.get('/post/:id',isAuth,todoController.getPost);
router.post('/post/:id/comment',isAuth,todoController.postComment);

module.exports = router;
