
// Carga las variables de entorno definidas en el archivo .env.
require("dotenv").config();

// Importa la aplicación Express con sus rutas y middlewares configurados.
const app = require("./app");

// Importa la instancia compartida de Prisma.
const prisma = require("./config/prisma");

// Define el puerto en el que se ejecutará el servidor.
const PORT = Number(process.env.PORT) || 3000;

// Declara la variable que almacenará la instancia del servidor HTTP.
let servidor;

// Evita ejecutar el servidor cuando este archivo se importa desde otro módulo.
if (require.main === module) {

    // Define una función asíncrona para iniciar el servidor.
    async function iniciarServidor() {

        try {

            // Comprueba la conexión con la base de datos antes de aceptar solicitudes.
            await prisma.$connect();

            // Inicia el servidor HTTP después de establecer la conexión.
            servidor = app.listen(PORT, function () {

                // Informa que el servidor inició correctamente.
                console.log(
                    `Servidor de Creaciones & Diseño ejecutándose en http://localhost:${PORT}`
                );

                // Confirma que la conexión con la base de datos está preparada.
                console.log("Conexión con Prisma establecida correctamente.");
            });

            // Gestiona los errores que ocurran mientras se inicia el servidor.
            servidor.on("error", function (error) {

                // Informa si el puerto ya está siendo utilizado.
                if (error.code === "EADDRINUSE") {
                    console.error(`El puerto ${PORT} ya está ocupado.`);
                } else {
                    // Registra otros errores relacionados con el servidor HTTP.
                    console.error("Error en el servidor HTTP:", error);
                }

                // Indica que el proceso no pudo continuar correctamente.
                process.exitCode = 1;
            });

        } catch (error) {

            // Registra el fallo de conexión o de inicio sin exponer detalles al cliente.
            console.error("No se pudo iniciar el servidor:", error.message);

            // Intenta liberar los recursos de Prisma antes de finalizar.
            try {
                await prisma.$disconnect();
            } catch (errorDesconexion) {
                console.error(
                    "Error al cerrar la conexión de Prisma:",
                    errorDesconexion.message
                );
            }

            // Indica que el proceso terminó con un error.
            process.exitCode = 1;
        }
    }

    // Ejecuta el procedimiento de inicio.
    iniciarServidor();

    // Define el procedimiento para cerrar el servidor de forma ordenada.
    async function cerrarServidor() {

        // Si el servidor ya está cerrado o no llegó a iniciarse, no continúa.
        if (!servidor) {
            await prisma.$disconnect();
            return;
        }

        // Deja de aceptar solicitudes nuevas y espera a que terminen las activas.
        servidor.close(async function (error) {

            if (error) {
                console.error("Error al cerrar el servidor HTTP:", error.message);
                process.exitCode = 1;
            }

            try {

                // Cierra la conexión de Prisma después de detener el servidor.
                await prisma.$disconnect();

                console.log("Conexión de Prisma cerrada correctamente.");

            } catch (errorDesconexion) {

                // Registra los errores que ocurran durante la desconexión.
                console.error(
                    "Error al cerrar la conexión de Prisma:",
                    errorDesconexion.message
                );

                process.exitCode = 1;
            }
        });
    }

    // Gestiona la señal de interrupción enviada normalmente con Ctrl+C.
    process.on("SIGINT", function () {
        cerrarServidor();
    });

    // Gestiona la señal de terminación utilizada habitualmente por los sistemas operativos.
    process.on("SIGTERM", function () {
        cerrarServidor();
    });
}

// Exporta la aplicación y la función para consultar el servidor HTTP.
module.exports = {
    app: app,
    obtenerServidor: function () {
        return servidor;
    }
};

