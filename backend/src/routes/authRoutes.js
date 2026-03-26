//Define las rutas (endpoints) relaciones a la autentificacion
// cada ruta esta conectado a una funcion de controlador

//RUTAS: POST -> /api/auth/login -> Iniciar Sesion
// Get api/auth/users -> Obtener lista de usuarios

const express = require('express');
const router = express.Router();

const {login, getUsers} = require('../controllers/authController');

//Post body {username: "owner", password: "12345"}

router.post('/login',login);

router.get('/users',getUsers);


module.exports = router;