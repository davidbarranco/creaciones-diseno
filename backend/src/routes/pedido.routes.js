
const express = require("express");

const pedidoController = require("../controllers/pedido.controller");

const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Registra un pedido. Requiere autenticación.
router.post("/", verificarToken, pedidoController.crearPedido);

// Consulta los pedidos del usuario autenticado.
router.get("/mis-pedidos", verificarToken, pedidoController.obtenerMisPedidos);

module.exports = router;
