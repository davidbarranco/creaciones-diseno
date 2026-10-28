
// Importa bcrypt para generar y verificar hashes de contraseñas.
const bcrypt = require("bcrypt");

// Importa jsonwebtoken para generar tokens de autenticación.
const jwt = require("jsonwebtoken");

// Importa el repositorio que contiene las operaciones de acceso a usuarios.
const usuarioRepository = require("../repositories/usuario.repository");

// Define las operaciones y reglas de negocio de la autenticación.
const authService = {

    // Registra un usuario nuevo después de comprobar sus datos básicos.
    async registrarUsuario(datosUsuario) {

        // Busca si ya existe una cuenta asociada al correo recibido.
        const usuarioExistente = await usuarioRepository.buscarPorCorreo(
            datosUsuario.correo
        );

        // Impide registrar otra cuenta con un correo que ya está registrado.
        if (usuarioExistente) {
            const error = new Error("El correo electrónico ya está registrado.");

            // Asigna un código que posteriormente podrá interpretar el controlador.
            error.code = "CORREO_DUPLICADO";

            // Detiene el registro y comunica el motivo del rechazo.
            throw error;
        }

        // Genera un hash de la contraseña original antes de guardarla.
        const passwordHash = await bcrypt.hash(datosUsuario.password, 10);

        // Prepara los datos que se guardarán en la base de datos.
        const nuevosDatosUsuario = {
            nombre: datosUsuario.nombre,
            apellido: datosUsuario.apellido,
            correo: datosUsuario.correo,

            // Al repositorio se envía el hash, nunca la contraseña original.
            password: passwordHash
        };

        // Solicita al repositorio que cree el usuario en MySQL.
        const usuarioCreado = await usuarioRepository.crearUsuario(
            nuevosDatosUsuario
        );

        // Devuelve únicamente los datos públicos del usuario registrado.
        // La contraseña y su hash no deben incluirse en la respuesta.
        return {
            id: usuarioCreado.id,
            nombre: usuarioCreado.nombre,
            apellido: usuarioCreado.apellido,
            correo: usuarioCreado.correo,
            fechaCreacion: usuarioCreado.fechaCreacion
        };
    },

    // Inicia sesión verificando las credenciales del usuario.
    async iniciarSesion(datosUsuario) {

        // Busca en la base de datos la cuenta asociada al correo recibido.
        const usuario = await usuarioRepository.buscarPorCorreo(
            datosUsuario.correo
        );

        // Si el usuario no existe, rechaza las credenciales.
        if (!usuario) {
            const error = new Error("Correo electrónico o contraseña incorrectos.");

            // Asigna un código para que el controlador responda con HTTP 401.
            error.code = "CREDENCIALES_INVALIDAS";

            // Detiene el proceso de inicio de sesión.
            throw error;
        }

        // Compara la contraseña recibida con el hash guardado en MySQL.
        const passwordCorrecta = await bcrypt.compare(
            datosUsuario.password,
            usuario.password
        );

        // Si la contraseña no coincide, rechaza las credenciales.
        if (!passwordCorrecta) {
            const error = new Error("Correo electrónico o contraseña incorrectos.");

            // Utiliza el mismo código tanto si el correo existe como si no.
            error.code = "CREDENCIALES_INVALIDAS";

            // Detiene el proceso de inicio de sesión.
            throw error;
        }

        // Comprueba que la clave secreta JWT esté configurada.
        if (!process.env.JWT_SECRET) {
            const error = new Error("La clave secreta de JWT no está configurada.");

            // Identifica un problema de configuración del servidor.
            error.code = "JWT_SECRET_NO_CONFIGURADA";

            // Evita generar un token sin la clave secreta.
            throw error;
        }

        // Genera un token firmado que identifica al usuario autenticado.
        const token = jwt.sign(
            {
                sub: String(usuario.id)
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        // Devuelve el token y los datos públicos de la cuenta.
        // Nunca devuelve la contraseña ni el hash almacenado.
        return {
            token: token,
            tipoToken: "Bearer",
            expiraEn: 3600,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                fechaCreacion: usuario.fechaCreacion
            }
        };
    }
};

// Exporta el servicio para que pueda utilizarse desde el controlador.
module.exports = authService;

