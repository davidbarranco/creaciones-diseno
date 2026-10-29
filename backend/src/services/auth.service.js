// Importa bcrypt para cifrar contraseñas y verificar credenciales.
const bcrypt = require("bcrypt");

// Importa jsonwebtoken para generar los tokens de autenticación.
const jwt = require("jsonwebtoken");

// Importa el repositorio encargado de consultar y guardar usuarios.
const usuarioRepository = require("../repositories/usuario.repository");

// Define los servicios relacionados con el registro y la autenticación.
const authService = {

    // Registra un nuevo usuario en la base de datos.
    async registrarUsuario(datosUsuario) {

        // Busca si ya existe un usuario con el correo proporcionado.
        const usuarioExistente = await usuarioRepository.buscarPorCorreo(
            datosUsuario.correo
        );

        // Evita registrar dos usuarios con el mismo correo electrónico.
        if (usuarioExistente) {

            // Crea un error que el controlador puede identificar.
            const error = new Error(
                "El correo electrónico ya está registrado."
            );

            // Asigna un código para identificar el conflicto.
            error.code = "CORREO_DUPLICADO";

            // Propaga el error para que lo gestione el controlador.
            throw error;
        }

        // Cifra la contraseña antes de almacenarla.
        const passwordHash = await bcrypt.hash(
            datosUsuario.password,
            10
        );

        // Prepara los datos que se guardarán en la base de datos.
        const datosNuevoUsuario = {
            nombre: datosUsuario.nombre,
            apellido: datosUsuario.apellido,
            correo: datosUsuario.correo,
            password: passwordHash
        };

        // Guarda el nuevo usuario mediante el repositorio.
        const usuarioCreado = await usuarioRepository.crearUsuario(
            datosNuevoUsuario
        );

        // Devuelve únicamente los datos públicos del usuario.
        return {
            id: usuarioCreado.id,
            nombre: usuarioCreado.nombre,
            apellido: usuarioCreado.apellido,
            correo: usuarioCreado.correo
        };
    },

    // Comprueba las credenciales e inicia una sesión.
    async iniciarSesion(datosUsuario) {

        // Busca al usuario utilizando su correo electrónico.
        const usuario = await usuarioRepository.buscarPorCorreo(
            datosUsuario.correo
        );

        // Rechaza el inicio de sesión si el usuario no existe.
        if (!usuario) {

            // Crea un error con un código identificable.
            const error = new Error(
                "Correo electrónico o contraseña incorrectos."
            );

            // Utiliza el mismo código para ambos casos de credenciales inválidas.
            error.code = "CREDENCIALES_INVALIDAS";

            // Propaga el error al controlador.
            throw error;
        }

        // Compara la contraseña recibida con el hash almacenado.
        const contrasenaValida = await bcrypt.compare(
            datosUsuario.password,
            usuario.password
        );

        // Rechaza el inicio de sesión si la contraseña es incorrecta.
        if (!contrasenaValida) {

            // Crea un error para identificar las credenciales incorrectas.
            const error = new Error(
                "Correo electrónico o contraseña incorrectos."
            );

            // Mantiene un mensaje genérico para proteger al usuario.
            error.code = "CREDENCIALES_INVALIDAS";

            // Propaga el error al controlador.
            throw error;
        }

        // Obtiene la clave secreta utilizada para firmar los tokens JWT.
        const jwtSecret = process.env.JWT_SECRET;

        // Comprueba que la clave secreta esté configurada.
        if (
            typeof jwtSecret !== "string" ||
            jwtSecret.trim().length === 0
        ) {

            // Crea un error que identifica un problema de configuración.
            const error = new Error(
                "La variable JWT_SECRET no está configurada correctamente."
            );

            // Asigna un código que reconoce el controlador.
            error.code = "JWT_SECRET_NO_CONFIGURADA";

            // Propaga el error para que lo gestione el controlador.
            throw error;
        }

        // Genera un token JWT asociado al identificador del usuario.
        const token = jwt.sign(
            {
                sub: String(usuario.id)
            },
            jwtSecret,
            {
                algorithm: "HS256",
                expiresIn: "1h"
            }
        );

        // Devuelve el token y los datos públicos del usuario autenticado.
        return {
            token: token,
            tipoToken: "Bearer",
            expiraEn: 3600,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo
            }
        };
    }
};

// Exporta los servicios para utilizarlos desde los controladores.
module.exports = authService;