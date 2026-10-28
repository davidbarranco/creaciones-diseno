
// Importa Zod para definir las reglas de validación de los datos.
const { z } = require("zod");

// Define las reglas que deben cumplir los datos de registro.
const esquemaRegistro = z.object({

    // El nombre es obligatorio y debe contener entre 2 y 100 caracteres.
    nombre: z.string({
        error: "El nombre debe ser un texto."
    })
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    // El apellido es obligatorio y debe contener entre 2 y 100 caracteres.
    apellido: z.string({
        error: "El apellido debe ser un texto."
    })
        .trim()
        .min(2, "El apellido debe tener al menos 2 caracteres.")
        .max(100, "El apellido no puede superar los 100 caracteres."),

    // El correo debe tener un formato válido y no superar 150 caracteres.
    correo: z.string({
        error: "El correo electrónico debe ser un texto."
    })
        .trim()
        .min(1, "El correo electrónico es obligatorio.")
        .max(150, "El correo electrónico no puede superar los 150 caracteres.")
        .email("Debes proporcionar un correo electrónico válido.")
        .transform(function (correo) {
            // Normaliza el correo para evitar diferencias entre mayúsculas y minúsculas.
            return correo.toLowerCase();
        }),

    // La contraseña debe tener al menos 8 caracteres.
    // No se aplica trim porque los espacios también pueden formar parte de una contraseña.
    password: z.string({
        error: "La contraseña debe ser un texto."
    })
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(72, "La contraseña no puede superar los 72 caracteres.")
});

// Define las reglas que deben cumplir los datos de inicio de sesión.
const esquemaLogin = z.object({

    // El correo es obligatorio y debe tener un formato válido.
    correo: z.string({
        error: "El correo electrónico debe ser un texto."
    })
        .trim()
        .min(1, "El correo electrónico es obligatorio.")
        .max(150, "El correo electrónico no puede superar los 150 caracteres.")
        .email("Debes proporcionar un correo electrónico válido.")
        .transform(function (correo) {
            // Normaliza el correo antes de buscar al usuario en la base de datos.
            return correo.toLowerCase();
        }),

    // La contraseña es obligatoria.
    // No se valida su longitud mínima en el login para no alterar las credenciales recibidas.
    password: z.string({
        error: "La contraseña debe ser un texto."
    })
        .min(1, "La contraseña es obligatoria.")
});

// Define las funciones que ejecutarán las validaciones.
const authValidator = {

    // Valida los datos enviados para registrar un usuario.
    validarRegistro(datos) {
        return esquemaRegistro.safeParse(datos);
    },

    // Valida los datos enviados para iniciar sesión.
    validarLogin(datos) {
        return esquemaLogin.safeParse(datos);
    }
};

// Exporta los validadores para utilizarlos desde otros archivos del backend.
module.exports = authValidator;