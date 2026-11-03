

const prisma = require("../config/prisma");

// Consultar todos los pedidos registrados
async function obtenerTodosLosPedidos() {
    return await prisma.pedido.findMany({
        include: {
            detalles: true
        },
        orderBy: {
            fechaCreacion: "desc"
        }
    });
}

// Buscar un pedido específico por su ID
async function buscarPedidoPorId(id) {
    return await prisma.pedido.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            detalles: true
        }
    });
}

// Actualizar el estado de un pedido
async function actualizarEstadoPedido(id, estado) {
    return await prisma.pedido.update({
        where: {
            id: Number(id)
        },
        data: {
            estado: estado
        }
    });
}

module.exports = {
    obtenerTodosLosPedidos,
    buscarPedidoPorId,
    actualizarEstadoPedido
};

