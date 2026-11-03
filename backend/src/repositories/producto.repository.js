
const prisma = require("../config/prisma");

// Consulta todos los productos.
async function obtenerProductos(soloDisponibles = false) {
    return await prisma.producto.findMany({
        where: soloDisponibles ? { disponible: true } : {},
        include: {
            variantes: true
        },
        orderBy: {
            fechaCreacion: "desc"
        }
    });
}

// Busca un producto por su identificador.
async function buscarProductoPorId(id) {
    return await prisma.producto.findUnique({
        where: { id: Number(id) },
        include: {
            variantes: true
        }
    });
}

// Registra un producto y sus variantes.
async function crearProducto(datos) {
    return await prisma.producto.create({
        data: {
            ...datos,
            variantes: {
                create: datos.variantes
            }
        },
        include: {
            variantes: true
        }
    });
}

// Actualiza un producto y sus variantes.
async function actualizarProducto(id, datos) {
    return await prisma.$transaction(async function (tx) {

        await tx.varianteProducto.deleteMany({
            where: { productoId: Number(id) }
        });

        return await tx.producto.update({
            where: { id: Number(id) },
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
                precio: datos.precio,
                categoria: datos.categoria,
                imagen: datos.imagen,
                stock: datos.stock,
                disponible: datos.disponible,
                requiereTalla: datos.requiereTalla,
                variantes: {
                    create: datos.variantes
                }
            },
            include: {
                variantes: true
            }
        });
    });
}

// Desactiva un producto sin eliminar su historial.
async function eliminarProducto(id) {
    return await prisma.producto.update({
        where: { id: Number(id) },
        data: { disponible: false }
    });
}

module.exports = {
    obtenerProductos,
    buscarProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};