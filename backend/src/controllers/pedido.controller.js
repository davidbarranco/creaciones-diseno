const pedidoService = require("../services/pedido.service");

// Recibe la solicitud y registra un nuevo pedido.
async function crearPedido(req, res) {
    try {
        const datosEntrega = req.body.datosEntrega;
        const productosCarrito = req.body.productos;

        // El identificador del usuario proviene del token JWT.
        const usuarioId = Number(req.usuarioAutenticado.id);

        if (!datosEntrega || !Array.isArray(productosCarrito)) {
            return res.status(400).json({
                mensaje: "Los datos del pedido no son válidos."
            });
        }

        const pedido = await pedidoService.crearPedido(
            datosEntrega,
            usuarioId,
            productosCarrito
        );

        return res.status(201).json({
            mensaje: "Pedido registrado correctamente.",
            pedido: pedido
        });

    } catch (error) {
        console.error("Error al crear el pedido:", error);

        return res.status(error.status || 500).json({
            mensaje: error.status
                ? error.message
                : "Error interno al registrar el pedido."
        });
    }
}

module.exports = { crearPedido };