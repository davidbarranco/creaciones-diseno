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
// Si FRONTEND_URL no está definida, utiliza la dirección habitual de Vite.
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

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

    // Devuelve una respuesta JSON que confirma que la API está disponible.
    return res.status(200).json({
        mensaje: "La API de Creaciones & Diseño está funcionando."
    });
});

// Registra las rutas de autenticación bajo el prefijo /api/v1/auth.
app.use("/api/v1/auth", authRoutes);

// Registra las rutas protegidas para comprobar la autenticación JWT.
app.use("/api/v1/prueba", pruebaRoutes);

// Exporta la aplicación para que server.js pueda iniciar el servidor.
module.exports = app;