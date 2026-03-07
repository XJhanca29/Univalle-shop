// src/infrastructure/routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Cuando alguien haga un POST a esta ruta, se ejecuta el controlador (Login / Registro)
router.post('/', UserController.createUser);

// NUEVA RUTA: Cuando alguien haga un PUT con su email en la URL, se actualiza el perfil
router.put('/:email', UserController.updateProfile);

router.get('/:email', UserController.getUser);

module.exports = router;