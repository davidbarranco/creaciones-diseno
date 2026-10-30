
const prisma = require("../config/prisma");

// Crea un pedido junto con todos sus productos.
async function crearPedido(datosPedido) {
    const pedido = await prisma.pedido.create({
        data: {
            usuarioId: datosPedido.usuarioId,
            nombre: datosPedido.nombre,
            apellido: datosPedido.apellido,
            correo: datosPedido.correo,
            telefono: datosPedido.telefono,
            direccion: datosPedido.direccion,
            ciudad: datosPedido.ciudad,
            departamento: datosPedido.departamento,
            indicaciones: datosPedido.indicaciones || null,
            total: datosPedido.total,

            detalles: {
                create: datosPedido.detalles.map(function (producto) {
                    return {
                        productoId: producto.productoId,
                        nombreProducto: producto.nombreProducto,
                        precio: producto.precio,
                        cantidad: producto.cantidad,
                        subtotal: producto.subtotal
                    };
                })
            }
        },
        include: {
            detalles: true
        }
    });

    return pedido;
}

// Busca un pedido por su identificador.
async function buscarPedidoPorId(id) {
    const pedido = await prisma.pedido.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            detalles: true,
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    correo: true
                }
            }
        }
    });

    return pedido;
}

// Consulta todos los pedidos de un usuario.
async function buscarPedidosPorUsuario(usuarioId) {
    const pedidos = await prisma.pedido.findMany({
        where: {
            usuarioId: Number(usuarioId)
        },
        include: {
            detalles: true
        },
        orderBy: {
            fechaCreacion: "desc"
        }
    });

    return pedidos;
}

module.exports = {
    crearPedido,
    buscarPedidoPorId,
    buscarPedidosPorUsuario
};
