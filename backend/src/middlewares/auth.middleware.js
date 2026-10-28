
// Importa jsonwebtoken para verificar los tokens de autenticación.
const jwt = require("jsonwebtoken");

// Define el middleware que protege las rutas de la API.
function verificarToken(req, res, next) {

    // Obtiene el encabezado Authorization de la solicitud HTTP.
    const encabezadoAutorizacion = req.headers.authorization;

    // Comprueba que el encabezado exista y utilice el esquema Bearer.
    if (
        !encabezadoAutorizacion ||
        !encabezadoAutorizacion.startsWith("Bearer ")
    ) {
        // Rechaza la solicitud si no se envió un token en el formato esperado.
        return res.status(401).json({
            mensaje: "Se requiere un token de autenticación."
        });
    }

    // Extrae el token que aparece después de la palabra Bearer.
    const token = encabezadoAutorizacion.slice(7).trim();

    // Rechaza un encabezado que no contenga un token.
    if (!token) {
        return res.status(401).json({
            mensaje: "El token de autenticación no es válido."
        });
    }

    // Comprueba que la clave secreta esté configurada.
    if (!process.env.JWT_SECRET) {
        // Registra el problema de configuración en el servidor.
        console.error("JWT_SECRET no está configurada.");

        // Informa que existe un problema interno de configuración.
        return res.status(500).json({
            mensaje: "El servicio de autenticación no está configurado correctamente."
        });
    }

    try {
        // Verifica la firma, el algoritmo permitido y la expiración del token.
        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Comprueba que el token contenga un identificador de usuario.
        if (
            typeof datosToken.sub !== "string" ||
            datosToken.sub.length === 0
        ) {
            return res.status(401).json({
                mensaje: "El token de autenticación no es válido."
            });
        }

        // Guarda la identidad verificada para que la siguiente función pueda utilizarla.
        req.usuarioAutenticado = {
            id: datosToken.sub
        };

        // Permite que Express continúe con el siguiente middleware o controlador.
        return next();

    } catch (error) {
        // Rechaza los tokens expirados, alterados o con una firma inválida.
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                mensaje: "El token es inválido o ha expirado."
            });
        }

        // Registra los errores inesperados para facilitar su diagnóstico.
        console.error("Error al verificar el token:", error);

        // Devuelve un error genérico para los fallos internos.
        return res.status(500).json({
            mensaje: "Ocurrió un error interno al verificar la autenticación."
        });
    }
}

// Exporta el middleware para utilizarlo en las rutas protegidas.
module.exports = {
    verificarToken: verificarToken
};
