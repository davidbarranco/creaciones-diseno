const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// =====================================================
// ADMINISTRACIÓN DE PEDIDOS
// =====================================================

// Consultar todos los pedidos.
export async function obtenerPedidos() {
    const token = localStorage.getItem("token");


    const respuesta = await fetch(`${API_URL}/admin/pedidos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar los pedidos.");
    }

    return await respuesta.json();


}

// Consultar un pedido por su ID.
export async function obtenerPedidoPorId(id) {
    const token = localStorage.getItem("token");


    const respuesta = await fetch(`${API_URL}/admin/pedidos/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar el pedido.");
    }

    return await respuesta.json();


}

// Actualizar el estado de un pedido.
export async function actualizarEstadoPedido(id, estado) {
    const token = localStorage.getItem("token");


    const respuesta = await fetch(`${API_URL}/admin/pedidos/${id}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
    });

    if (!respuesta.ok) {
        throw new Error("No fue posible actualizar el estado del pedido.");
    }

    return await respuesta.json();


}

// =====================================================
// ADMINISTRACIÓN DE PRODUCTOS
// =====================================================

// Consultar todos los productos.
export async function obtenerProductosAdmin() {
    const token = localStorage.getItem("token");


    const respuesta = await fetch(`${API_URL}/admin/productos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar los productos.");
    }

    return await respuesta.json();


}

// Prepara los datos del producto para enviarlos mediante FormData.
function prepararFormularioProducto(datos) {
    const formulario = new FormData();


    Object.entries(datos).forEach(([campo, valor]) => {
        if (valor === undefined || valor === null) {
            return;
        }

        // Las variantes se envían como una cadena JSON.
        if (campo === "variantes") {
            formulario.append(campo, JSON.stringify(valor));
            return;
        }

        // Los demás campos se convierten a texto.
        formulario.append(campo, valor);
    });

    return formulario;


}

// Crea un producto nuevo y envía sus datos al backend.
export async function crearProducto(datos) {
    const token = localStorage.getItem("token");

    // Prepara los datos como FormData para permitir enviar imágenes.
    const formulario = prepararFormularioProducto(datos);

    const respuesta = await fetch(`${API_URL}/admin/productos`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formulario
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.mensaje || "No fue posible crear el producto.");
    }

    return await respuesta.json();
}

// Actualiza un producto existente y permite enviar una nueva imagen.
export async function actualizarProducto(id, datos) {
    const token = localStorage.getItem("token");

    // Prepara los datos como FormData para permitir enviar imágenes.
    const formulario = prepararFormularioProducto(datos);

    const respuesta = await fetch(`${API_URL}/admin/productos/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formulario
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.mensaje || "No fue posible actualizar el producto.");
    }

    return await respuesta.json();
}

// Desactiva un producto existente.
export async function desactivarProducto(id) {
    const token = localStorage.getItem("token");

    const respuesta = await fetch(`${API_URL}/admin/productos/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.mensaje || "No fue posible desactivar el producto.");
    }

    return await respuesta.json();
}