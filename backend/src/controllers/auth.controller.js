
// Importa el servicio que contiene la lógica de negocio de autenticación.
const authService = require("../services/auth.service");

// Importa el validador de los datos de registro e inicio de sesión.
const authValidator = require("../validators/auth.validator");

// Define los controladores relacionados con la autenticación.
const authController = {

    // Atiende las solicitudes HTTP para registrar un usuario.
    async registrarUsuario(req, res) {

        try {
            // Obtiene los datos enviados por el cliente en el cuerpo de la solicitud.
            const datosUsuario = req.body;

            // Comprueba que los datos recibidos cumplan las reglas de registro.
            const resultadoValidacion = authValidator.validarRegistro(datosUsuario);

            // Si los datos no son válidos, responde con HTTP 400.
            if (!resultadoValidacion.success) {

                // Extrae los errores de validación y los prepara para la respuesta.
                const errores = resultadoValidacion.error.issues.map(function (error) {
                    return {
                        campo: error.path.join("."),
                        mensaje: error.message
                    };
                });

                // Informa al cliente que debe corregir los datos enviados.
                return res.status(400).json({
                    mensaje: "Los datos enviados no son válidos.",
                    errores: errores
                });
            }

            // Envía al servicio los datos que ya fueron validados.
            const usuarioCreado = await authService.registrarUsuario(
                resultadoValidacion.data
            );

            // Devuelve HTTP 201 porque el usuario fue creado correctamente.
            return res.status(201).json({
                mensaje: "Usuario registrado correctamente.",
                usuario: usuarioCreado
            });

        } catch (error) {

            // Reconoce el error que indica que el correo ya está registrado.
            if (error.code === "CORREO_DUPLICADO") {

                // Devuelve HTTP 409 porque existe un conflicto con el registro.
                return res.status(409).json({
                    mensaje: "El correo electrónico ya está registrado."
                });
            }

            // Registra los detalles técnicos en el servidor para facilitar el diagnóstico.
            console.error("Error al registrar el usuario:", error);

            // Devuelve un mensaje genérico sin exponer detalles internos.
            return res.status(500).json({
                mensaje: "Ocurrió un error interno al registrar el usuario."
            });
        }
    },

    // Atiende las solicitudes HTTP para iniciar sesión.
    async iniciarSesion(req, res) {

        try {
            // Obtiene el correo y la contraseña enviados por el cliente.
            const datosUsuario = req.body;

            // Comprueba que los datos recibidos cumplan las reglas del inicio de sesión.
            const resultadoValidacion = authValidator.validarLogin(datosUsuario);

            // Si los datos no son válidos, responde con HTTP 400.
            if (!resultadoValidacion.success) {

                // Extrae los errores de validación para informar qué debe corregirse.
                const errores = resultadoValidacion.error.issues.map(function (error) {
                    return {
                        campo: error.path.join("."),
                        mensaje: error.message
                    };
                });

                // Devuelve los errores de validación al cliente.
                return res.status(400).json({
                    mensaje: "Los datos enviados no son válidos.",
                    errores: errores
                });
            }

            // Envía los datos validados al servicio para verificar las credenciales.
            const resultadoLogin = await authService.iniciarSesion(
                resultadoValidacion.data
            );

            // Devuelve HTTP 200 cuando la autenticación es exitosa.
            return res.status(200).json({
                mensaje: "Inicio de sesión exitoso.",
                token: resultadoLogin.token,
                tipoToken: resultadoLogin.tipoToken,
                expiraEn: resultadoLogin.expiraEn,
                usuario: resultadoLogin.usuario
            });

        } catch (error) {

            // Reconoce las credenciales incorrectas o el usuario inexistente.
            if (error.code === "CREDENCIALES_INVALIDAS") {

                // Utiliza un mensaje genérico para ambos casos.
                return res.status(401).json({
                    mensaje: "Correo electrónico o contraseña incorrectos."
                });
            }

            // Registra los detalles técnicos si falta la configuración de JWT.
            if (error.code === "JWT_SECRET_NO_CONFIGURADA") {
                console.error("Error de configuración:", error.message);

                // Devuelve un error interno sin exponer información confidencial.
                return res.status(500).json({
                    mensaje: "El servicio de autenticación no está configurado correctamente."
                });
            }

            // Registra otros errores para facilitar el diagnóstico en el servidor.
            console.error("Error al iniciar sesión:", error);

            // Devuelve un mensaje genérico para los errores inesperados.
            return res.status(500).json({
                mensaje: "Ocurrió un error interno al iniciar sesión."
            });
        }
    }
};

// Exporta los controladores para utilizarlos desde las rutas de Express.
module.exports = authController;

