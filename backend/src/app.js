
// Importa Express para crear y configurar la aplicación web.
const express = require("express");

// Importa CORS para controlar las solicitudes desde otros orígenes.
const cors = require("cors");

// Importa las rutas relacionadas con el registro y la autenticación.
const authRoutes = require("./routes/auth.routes");

// Importa las rutas para probar la autenticación JWT.
const pruebaRoutes = require("./routes/prueba.routes");

// Crea la instancia principal de la aplicación Express.
const app = express();

// Configura el origen autorizado para realizar solicitudes desde el frontend.
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const pedidoRoutes = require("./routes/pedido.routes");

// Configura CORS para permitir solicitudes desde el frontend autorizado.
app.use(cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Permite que Express interprete los cuerpos de las solicitudes en formato JSON.
app.use(express.json());

// Define una ruta básica para comprobar el estado de la API.
app.get("/api/v1/estado", function (req, res) {
    return res.status(200).json({
        mensaje: "La API de Creaciones & Diseño está funcionando."
    });
});

// Registra las rutas de autenticación.
app.use("/api/v1/auth", authRoutes);

// Registra las rutas para comprobar la autenticación JWT.
app.use("/api/v1/prueba", pruebaRoutes);

app.use("/api/v1/pedidos", pedidoRoutes);

// Gestiona las solicitudes dirigidas a rutas inexistentes.
app.use(function (req, res) {
    return res.status(404).json({
        mensaje: "La ruta solicitada no existe."
    });
});

// Maneja errores de JSON mal formado y otros errores que lleguen al middleware.
app.use(function (error, req, res, next) {
    // Si la solicitud contiene JSON mal formado, devuelve HTTP 400.
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud contiene JSON inválido."
        });
    }

    // Registra los detalles técnicos del error únicamente en el servidor.
    console.error("Error no controlado en la API:", error);

    // Evita enviar detalles internos al cliente.
    return res.status(500).json({
        mensaje: "Ocurrió un error interno en el servidor."
    });
});

// Exporta la aplicación para que server.js pueda iniciar el servidor.
module.exports = app;

