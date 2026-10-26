
// Importa bcrypt para generar y verificar hashes de contraseñas.
const bcrypt = require("bcrypt");

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
    }
};

// Exporta el servicio para que pueda utilizarse desde el controlador.
module.exports = authService;

