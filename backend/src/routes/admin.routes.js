const express = require("express");

const router = express.Router();

const {
    verificarToken,
    verificarAdministrador
} = require("../middlewares/auth.middleware");

const subirImagen = require("../middlewares/subirImagen.middleware");

const adminController = require("../controllers/admin.controller");
const productoController = require("../controllers/producto.controller");

// Todas las rutas requieren permisos de administrador.
router.use(verificarToken, verificarAdministrador);

// =====================================================
// ADMINISTRACIÓN DE PEDIDOS
// =====================================================

router.get("/pedidos", adminController.obtenerTodosLosPedidos);

router.get("/pedidos/:id", adminController.obtenerPedidoPorId);

router.patch("/pedidos/:id/estado", adminController.cambiarEstadoPedido);

// =====================================================
// ADMINISTRACIÓN DE PRODUCTOS
// =====================================================

router.get("/productos", productoController.obtenerTodosLosProductos);

// Registrar producto y recibir una imagen opcional.
router.post(
    "/productos",
    subirImagen.single("imagen"),
    productoController.crearProducto
);

// Actualizar producto y permitir cambiar su imagen.
router.put(
    "/productos/:id",
    subirImagen.single("imagen"),
    productoController.actualizarProducto
);

// Desactivar producto.
router.delete("/productos/:id", productoController.eliminarProducto);

module.exports = router;