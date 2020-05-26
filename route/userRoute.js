const express = require('express')
const router = express.Router()
const { check } = require('express-validator');
const userController = require('../controller/userController')

// http://localhost:5055/api/user-sign-up
//{"user_name":"kumo","email":"kumo@gmail.com","password":"kumo123"}
router.post("/user-sign-up",[
    check('user_name').trim().notEmpty()
    .withMessage('User name is required'),
    check('email').trim().notEmpty(),
    check('password').trim().notEmpty()
    .withMessage('password is required'),
],userController.userSignup)

// http://localhost:5055/api/login
// {
//     "userName":"kumo",
//     "password":"kumo123"
//   }
router.post('/login',[
    check('userName').trim().notEmpty()
    .withMessage('User name is required'),
    // check('email').trim().notEmpty(),
    check('password').trim().notEmpty()
    .withMessage('password is required'),
],userController.userLogin)

module.exports=router