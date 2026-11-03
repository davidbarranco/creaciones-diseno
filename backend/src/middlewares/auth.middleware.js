const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// Verifica la autenticidad del token y consulta el rol del usuario.
async function verificarToken(req, res, next) {
    const encabezadoAutorizacion = req.headers.authorization;

    if (
        !encabezadoAutorizacion ||
        !encabezadoAutorizacion.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            mensaje: "Se requiere un token de autenticación."
        });
    }

    const token = encabezadoAutorizacion.slice(7).trim();

    if (!token) {
        return res.status(401).json({
            mensaje: "El token de autenticación no es válido."
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET no está configurada.");

        return res.status(500).json({
            mensaje: "El servicio de autenticación no está configurado correctamente."
        });
    }

    try {
        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        if (
            typeof datosToken.sub !== "string" ||
            !/^[1-9]\d*$/.test(datosToken.sub)
        ) {
            return res.status(401).json({
                mensaje: "El token de autenticación no es válido."
            });
        }

        // Consulta el usuario para obtener su rol actual desde MySQL.
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: Number(datosToken.sub)
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                correo: true,
                rol: true
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "El usuario asociado al token no existe."
            });
        }

        req.usuarioAutenticado = usuario;

        return next();

    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                mensaje: "El token es inválido o ha expirado."
            });
        }

        console.error("Error al verificar el token:", error);

        return res.status(500).json({
            mensaje: "Ocurrió un error interno al verificar la autenticación."
        });
    }
}

// Comprueba que el usuario tenga el rol de administrador.
function verificarAdministrador(req, res, next) {
    if (!req.usuarioAutenticado) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder."
        });
    }

    if (req.usuarioAutenticado.rol !== "ADMIN") {
        return res.status(403).json({
            mensaje: "No tienes permisos para acceder a esta funcionalidad."
        });
    }

    return next();
}

module.exports = {
    verificarToken,
    verificarAdministrador
};