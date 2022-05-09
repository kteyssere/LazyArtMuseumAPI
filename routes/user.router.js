const express = require('express');
const usersController = require('../controllers/user.controller')

const userRouter = express.Router();
userRouter.get('/', usersController.getUsers);
userRouter.get('/:id', usersController.getUser);
userRouter.get('/name/:name', usersController.getUsersByName);
userRouter.get('/email/:email', usersController.getUsersByEmail);
userRouter.get('/password/:password', usersController.getUsersByPassword);
userRouter.get('/roles/:roles', usersController.getUsersByRoles);
userRouter.post('/:id', usersController.postUser);
userRouter.put('/', usersController.putUser);
userRouter.delete('/:id', usersController.deleteUser);

module.exports = userRouter;