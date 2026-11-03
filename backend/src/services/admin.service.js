const adminRepository = require("../repositories/admin.repository");

// Estados permitidos para los pedidos.
const ESTADOS_PEDIDO = [
    "PENDIENTE",
    "EN_PREPARACION",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO"
];

// Consultar todos los pedidos.
async function obtenerTodosLosPedidos() {
    return await adminRepository.obtenerTodosLosPedidos();
}

// Consultar un pedido por su ID.
async function obtenerPedidoPorId(id) {
    const pedido = await adminRepository.buscarPedidoPorId(id);

    if (!pedido) {
        const error = new Error("El pedido solicitado no existe.");
        error.statusCode = 404;
        throw error;
    }

    return pedido;
}

// Actualizar el estado de un pedido.
async function cambiarEstadoPedido(id, estado) {
    if (!ESTADOS_PEDIDO.includes(estado)) {
        const error = new Error("El estado del pedido no es válido.");
        error.statusCode = 400;
        throw error;
    }

    const pedido = await adminRepository.buscarPedidoPorId(id);

    if (!pedido) {
        const error = new Error("El pedido solicitado no existe.");
        error.statusCode = 404;
        throw error;
    }

    return await adminRepository.actualizarEstadoPedido(id, estado);
}

module.exports = {
    obtenerTodosLosPedidos,
    obtenerPedidoPorId,
    cambiarEstadoPedido
};