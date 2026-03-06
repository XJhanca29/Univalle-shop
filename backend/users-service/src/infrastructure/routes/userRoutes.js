// src/infrastructure/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Cuando alguien haga un POST a esta ruta, se ejecuta el controlador
router.post('/', UserController.createUser);

module.exports = router;