const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/UserController');

// Las rutas deben ser '/' en lugar de '/users' y '/login' ya que en server.js ya estás utilizando '/api/users' como base para estas rutas.
router.post('/', createUser);
router.post('/login', loginUser);
module.exports = router;
