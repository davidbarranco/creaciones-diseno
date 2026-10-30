
const pedidoRepository = require("../repositories/pedido.repository");
const { buscarProductoPorId } = require("../catalog/productos");

// Valida los productos y calcula los valores oficiales del pedido.
async function crearPedido(datosEntrega, usuarioId, productosCarrito) {

    if (!Array.isArray(productosCarrito) || productosCarrito.length === 0) {
        const error = new Error("El carrito está vacío.");
        error.status = 400;
        throw error;
    }

    let totalPedido = 0;
    const detallesPedido = [];

    for (const item of productosCarrito) {

        const producto = buscarProductoPorId(item.id);

        if (!producto) {
            const error = new Error(
                `El producto con identificador ${item.id} no existe.`
            );
            error.status = 400;
            throw error;
        }

        const cantidad = Number(item.cantidad);

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            const error = new Error(
                `La cantidad del producto ${producto.nombre} no es válida.`
            );
            error.status = 400;
            throw error;
        }

        const subtotal = producto.precio * cantidad;

        totalPedido += subtotal;

        detallesPedido.push({
            productoId: producto.id,
            nombreProducto: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            subtotal: subtotal
        });
    }

    const nuevoPedido = {
        usuarioId: usuarioId,
        nombre: datosEntrega.nombre,
        apellido: datosEntrega.apellido,
        correo: datosEntrega.correo,
        telefono: datosEntrega.telefono,
        direccion: datosEntrega.direccion,
        ciudad: datosEntrega.ciudad,
        departamento: datosEntrega.departamento,
        indicaciones: datosEntrega.indicaciones,
        total: totalPedido,
        detalles: detallesPedido
    };

    return await pedidoRepository.crearPedido(nuevoPedido);
}

module.exports = {
    crearPedido
};

