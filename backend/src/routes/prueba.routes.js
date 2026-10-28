
// Importa Express para crear el enrutador.
const express = require("express");

// Crea una instancia del enrutador.
const router = express.Router();

// Importa el middleware que verifica los tokens JWT.
const authMiddleware = require("../middlewares/auth.middleware");

// Importa el controlador del recurso protegido.
const pruebaController = require("../controllers/prueba.controller");

// Define una ruta protegida que exige un token JWT válido.
router.get(
    "/protegido",
    authMiddleware.verificarToken,
    pruebaController.obtenerRecursoProtegido
);

// Exporta las rutas para utilizarlas en la aplicación principal.
module.exports = router;

