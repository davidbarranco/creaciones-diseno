
const productoService = require("../services/producto.service");

// Convierte los campos de texto recibidos mediante FormData.
function prepararDatosProducto(body, archivo) {

    const datos = { ...body };

    // Convierte los valores numéricos.
    if (datos.precio !== undefined) {
        datos.precio = Number(datos.precio);
    }

    if (datos.stock !== undefined) {
        datos.stock = Number(datos.stock);
    }

    // Convierte los valores booleanos.
    if (datos.requiereTalla !== undefined) {
        datos.requiereTalla = datos.requiereTalla === "true";
    }

    if (datos.disponible !== undefined) {
        datos.disponible = datos.disponible === "true";
    }

    // Convierte las variantes recibidas como JSON.
    if (typeof datos.variantes === "string") {
        datos.variantes = JSON.parse(datos.variantes);
    }

    // Si se seleccionó una imagen, utiliza su ruta local.
    if (archivo) {
        datos.imagen = `/uploads/${archivo.filename}`;
    }

    return datos;
}

// Consulta los productos disponibles para el catálogo público.
async function obtenerProductos(req, res, next) {
    try {
        const productos = await productoService.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
}

// Consulta todos los productos para la administración.
async function obtenerTodosLosProductos(req, res, next) {
    try {
        const productos = await productoService.obtenerTodosLosProductos();
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
}

// Registra un producto nuevo.
async function crearProducto(req, res, next) {
    try {
        const datosProducto = prepararDatosProducto(req.body, req.file);

        const producto = await productoService.crearProducto(datosProducto);

        res.status(201).json({
            mensaje: "Producto creado correctamente.",
            producto
        });

    } catch (error) {
        next(error);
    }
}

// Actualiza los datos de un producto.
async function actualizarProducto(req, res, next) {
    try {
        const datosProducto = prepararDatosProducto(req.body, req.file);

        const producto = await productoService.actualizarProducto(
            req.params.id,
            datosProducto
        );

        res.status(200).json({
            mensaje: "Producto actualizado correctamente.",
            producto
        });

    } catch (error) {
        next(error);
    }
}

// Desactiva un producto sin eliminarlo de la base de datos.
async function eliminarProducto(req, res, next) {
    try {
        await productoService.eliminarProducto(req.params.id);

        res.status(200).json({
            mensaje: "Producto desactivado correctamente."
        });

    } catch (error) {
        next(error);
    }
}

// Consulta un producto por su ID.
async function obtenerProductoPorId(req, res, next) {
    try {
        const producto = await productoService.obtenerProductoPorId(req.params.id);
        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    obtenerTodosLosProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};

