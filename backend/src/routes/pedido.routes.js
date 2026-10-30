
const express = require("express");
const pedidoController = require("../controllers/pedido.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Registra un pedido. Requiere autenticación.
router.post("/", verificarToken, pedidoController.crearPedido);

module.exports = router;

