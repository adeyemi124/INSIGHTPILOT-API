// filepath: c:\Users\User\Documents\INSIGHT_PILOT\BACKEND\routes\userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');

const setUserRoutes = (app) => {
    const userController = new UserController();
    const router = express.Router();

    router.get('/users', userController.getAllUsers.bind(userController));
    router.get('/users/:id', userController.getUserById.bind(userController));
    router.post('/users', userController.createUser.bind(userController));
    router.put('/users/:id', userController.updateUser.bind(userController));

    app.use('/api', router);
};

module.exports = setUserRoutes;