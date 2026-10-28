
// Carga las variables de entorno del archivo .env.
require("dotenv").config();

// Importa jsonwebtoken para generar el token de prueba.
const jwt = require("jsonwebtoken");

// Comprueba que exista la clave secreta necesaria.
if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET no está configurada.");
    process.exit(1);
}

// Genera un token válido durante un segundo.
const token = jwt.sign(
    { sub: "2" },
    process.env.JWT_SECRET,
    {
        algorithm: "HS256",
        expiresIn: "1s"
    }
);

// Muestra el token de prueba en la terminal.
console.log("Token de prueba generado:");
console.log(token);

// Espera dos segundos para que el token expire.
setTimeout(function () {

    // Indica cuándo el token ya debería estar expirado.
    console.log("El token ya debería estar expirado.");

}, 2000);

