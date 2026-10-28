
// Importa Express para crear un enrutador independiente.
const express = require("express");

// Crea una instancia del enrutador de Express.
const router = express.Router();

// Importa los controladores que atenderán las solicitudes de autenticación.
const authController = require("../controllers/auth.controller");

// Define la ruta para registrar un usuario.
// Endpoint completo: POST /api/v1/auth/registro
router.post("/registro", authController.registrarUsuario);

// Define la ruta para iniciar sesión.
// Endpoint completo: POST /api/v1/auth/login
router.post("/login", authController.iniciarSesion);

// Exporta el enrutador para incorporarlo en la aplicación principal.
module.exports = router;

