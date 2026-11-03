
const productoRepository = require("../repositories/producto.repository");

const TALLAS_PERMITIDAS = [
    "S", "M", "L", "XL", "XXL", "XXXL"
];

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

// Valida y prepara los datos del producto.
function validarDatosProducto(datos) {

    const {
        nombre,
        descripcion,
        precio,
        categoria,
        imagen,
        stock,
        disponible,
        requiereTalla,
        variantes
    } = datos;

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        nombre.length > 150
    ) {
        throw crearError("El nombre del producto no es válido.", 400);
    }

    if (
        typeof categoria !== "string" ||
        !categoria.trim() ||
        categoria.length > 100
    ) {
        throw crearError("La categoría no es válida.", 400);
    }

    const precioNumerico = Number(precio);

    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
        throw crearError("El precio debe ser mayor que cero.", 400);
    }

    if (imagen !== undefined && imagen !== null &&
        (typeof imagen !== "string" || imagen.length > 500)) {
        throw crearError("La dirección de la imagen no es válida.", 400);
    }

    if (typeof requiereTalla !== "boolean") {
        throw crearError("Debes indicar si el producto requiere talla.", 400);
    }

    const datosPreparados = {
        nombre: nombre.trim(),
        descripcion: descripcion || null,
        precio: precioNumerico,
        categoria: categoria.trim(),
        imagen: imagen || null,
        disponible: disponible === undefined ? true : disponible,
        requiereTalla,
        stock: 0,
        variantes: []
    };

    if (typeof datosPreparados.disponible !== "boolean") {
        throw crearError("El campo disponible debe ser verdadero o falso.", 400);
    }

    if (requiereTalla) {

        if (!Array.isArray(variantes) || variantes.length === 0) {
            throw crearError("Debes registrar al menos una talla.", 400);
        }

        const tallasRegistradas = new Set();

        datosPreparados.variantes = variantes.map(function (variante) {

            if (!TALLAS_PERMITIDAS.includes(variante.talla)) {
                throw crearError("Una de las tallas no es válida.", 400);
            }

            if (tallasRegistradas.has(variante.talla)) {
                throw crearError("No puedes repetir una talla.", 400);
            }

            const cantidad = Number(variante.stock);

            if (!Number.isInteger(cantidad) || cantidad < 0) {
                throw crearError("El inventario de una talla no es válido.", 400);
            }

            tallasRegistradas.add(variante.talla);

            return {
                talla: variante.talla,
                stock: cantidad
            };
        });

    } else {

        const cantidad = Number(stock);

        if (!Number.isInteger(cantidad) || cantidad < 0) {
            throw crearError("El inventario del producto no es válido.", 400);
        }

        datosPreparados.stock = cantidad;
    }

    return datosPreparados;
}

// Consulta los productos disponibles.
async function obtenerProductos() {
    return await productoRepository.obtenerProductos(true);
}

// Consulta todos los productos administrativos.
async function obtenerTodosLosProductos() {
    return await productoRepository.obtenerProductos(false);
}

// Consulta un producto por ID.
async function obtenerProductoPorId(id, soloDisponibles = false) {

    if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
        throw crearError("El identificador del producto no es válido.", 400);
    }

    const producto = await productoRepository.buscarProductoPorId(id);

    if (!producto || (soloDisponibles && !producto.disponible)) {
        throw crearError("El producto solicitado no existe.", 404);
    }

    return producto;
}

// Registra un producto.
async function crearProducto(datos) {
    const datosValidados = validarDatosProducto(datos);
    return await productoRepository.crearProducto(datosValidados);
}

// Edita un producto.
async function actualizarProducto(id, datos) {
    await obtenerProductoPorId(id);

    const datosValidados = validarDatosProducto(datos);

    return await productoRepository.actualizarProducto(
        id,
        datosValidados
    );
}

// Desactiva un producto.
async function eliminarProducto(id) {
    await obtenerProductoPorId(id);
    return await productoRepository.eliminarProducto(id);
}

module.exports = {
    obtenerProductos,
    obtenerTodosLosProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};