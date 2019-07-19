const express = require("express");
const router = express.Router();
//middleware
const isAuth = require('../middleware/is-auth');
const isNotAuth = require('../middleware/is-not-auth');
const userController = require('../controllers/users');

router.get('/users',isAuth,userController.getUsers);
router.post('/users',isAuth,userController.addUsers);
router.get('/users/delete/:id',isAuth,userController.deleteUser);
router.get('/users/login',isNotAuth,userController.getLogin);
router.post('/users/login',userController.postLogin);
router.get('/users/logout',userController.logoutUser);
router.get('/users/register',isNotAuth,userController.getRegister);
router.post('/users/register',userController.postRegister);
router.get('/users/reset',isNotAuth,userController.getReset);
router.post('/users/reset',userController.postReset);
module.exports = router;
