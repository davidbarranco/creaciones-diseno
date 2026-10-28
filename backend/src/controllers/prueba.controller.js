
// Define los controladores utilizados para comprobar la autenticación.
const pruebaController = {

    // Atiende las solicitudes a una ruta protegida.
    obtenerRecursoProtegido(req, res) {

        // Devuelve una respuesta que confirma que el acceso fue autorizado.
        return res.status(200).json({
            mensaje: "Acceso autorizado. El token JWT es válido.",
            usuario: {
                id: req.usuarioAutenticado.id
            }
        });
    }
};

// Exporta los controladores para utilizarlos desde las rutas.
module.exports = pruebaController;

