const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route: POST /UserRegister
router.post('/UserRegister', userController.registerUser);

// LOGIN
router.post('/login', userController.loginUser);

// READ
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

// UPDATE
router.put('/users/:id', userController.updateUser);

// DELETE
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
