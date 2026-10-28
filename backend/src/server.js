// Carga las variables de entorno definidas en el archivo .env.
require("dotenv").config();

// Importa la aplicación Express que configuramos en app.js.
const app = require("./app");

// Define el puerto del servidor.
// Si existe la variable PORT, utiliza su valor.
// Si no existe, utiliza el puerto 3000.
const PORT = process.env.PORT || 3000;

// Declara la variable que almacenará el servidor HTTP.
let servidor;

// Inicia el servidor únicamente cuando este archivo se ejecuta directamente.
if (require.main === module) {

    // Inicia el servidor HTTP y lo deja escuchando solicitudes.
    servidor = app.listen(PORT, function () {

        // Muestra la dirección donde está funcionando la API.
        console.log(
            `Servidor de Creaciones & Diseño ejecutándose en http://localhost:${PORT}`
        );

        // Informa que el servidor está preparado para recibir solicitudes.
        console.log("Servidor iniciado correctamente.");
    });

    // Gestiona los errores que impiden que el servidor escuche en el puerto.
    servidor.on("error", function (error) {

        // Informa si el puerto ya está ocupado.
        if (error.code === "EADDRINUSE") {
            console.error(`El puerto ${PORT} ya está ocupado.`);
            return;
        }

        // Informa cualquier otro error al iniciar el servidor.
        console.error("Error al iniciar el servidor:", error);
    });
}

// Exporta la aplicación y el servidor para facilitar las pruebas.
module.exports = {
    app: app,
    servidor: servidor
};