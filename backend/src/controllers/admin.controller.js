
const adminService = require("../services/admin.service");

// Consultar todos los pedidos
async function obtenerTodosLosPedidos(req, res, next) {
    try {
        const pedidos = await adminService.obtenerTodosLosPedidos();

        return res.status(200).json({
            mensaje: "Pedidos consultados correctamente.",
            total: pedidos.length,
            pedidos
        });
    } catch (error) {
        next(error);
    }
}

// Consultar un pedido por su ID
async function obtenerPedidoPorId(req, res, next) {
    try {
        const { id } = req.params;

        const pedido = await adminService.obtenerPedidoPorId(id);

        return res.status(200).json({
            mensaje: "Pedido consultado correctamente.",
            pedido
        });
    } catch (error) {
        next(error);
    }
}

// Actualizar el estado de un pedido
async function cambiarEstadoPedido(req, res, next) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const pedido = await adminService.cambiarEstadoPedido(id, estado);

        return res.status(200).json({
            mensaje: "Estado del pedido actualizado correctamente.",
            pedido
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerTodosLosPedidos,
    obtenerPedidoPorId,
    cambiarEstadoPedido
};