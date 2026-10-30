const API_URL = import.meta.env.VITE_API_URL;

// Registra un nuevo usuario en el backend.
async function registrarUsuario(datosUsuario) {
    const respuesta = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No fue posible registrar el usuario.");
    }

    return datos;
}

// Envía las credenciales para iniciar sesión.
async function iniciarSesion(datosUsuario) {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No fue posible iniciar sesión.");
    }

    return datos;
}

const authService = {
    registrarUsuario,
    iniciarSesion
};

export default authService;