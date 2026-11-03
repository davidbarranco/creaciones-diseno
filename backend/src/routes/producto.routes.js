

const express = require("express");

const router = express.Router();

const productoController = require("../controllers/producto.controller");

// Consultar catálogo público.
router.get("/", productoController.obtenerProductos);

// Consultar producto por ID.
router.get("/:id", productoController.obtenerProductoPorId);

module.exports = router;