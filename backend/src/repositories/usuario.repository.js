
// Importa la instancia compartida de Prisma para acceder a la base de datos.
const prisma = require("../config/prisma");

// Define las operaciones de acceso a datos relacionadas con los usuarios.
const usuarioRepository = {

    // Busca un usuario utilizando su dirección de correo electrónico.
    async buscarPorCorreo(correo) {

        // Consulta la tabla usuarios y devuelve el primer registro coincidente.
        const usuario = await prisma.usuario.findUnique({
            where: {
                correo: correo
            }
        });

        // Devuelve el usuario encontrado o null si no existe.
        return usuario;
    },

    // Busca un usuario utilizando su identificador único.
    async buscarPorId(id) {

        // Consulta la tabla usuarios por su clave primaria.
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: id
            }
        });

        // Devuelve el usuario encontrado o null si no existe.
        return usuario;
    },

    // Guarda un nuevo usuario en la base de datos.
    async crearUsuario(datosUsuario) {

        // Inserta el usuario utilizando los datos recibidos del servicio.
        const usuario = await prisma.usuario.create({
            data: {
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                correo: datosUsuario.correo,

                // Este campo debe recibir el hash de la contraseña,
                // nunca la contraseña original.
                password: datosUsuario.password
            }
        });

        // Devuelve el registro creado para que el servicio pueda procesarlo.
        return usuario;
    }
};

// Exporta el repositorio para utilizarlo desde el servicio de autenticación.
module.exports = usuarioRepository;

