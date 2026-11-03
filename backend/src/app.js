
// Importa Express para crear y configurar la aplicación web.
const express = require("express");

// Importa Path para gestionar las rutas de los archivos.
const path = require("path");

// Importa CORS para controlar las solicitudes desde otros orígenes.
const cors = require("cors");

// Importa las rutas de autenticación.
const authRoutes = require("./routes/auth.routes");

// Importa las rutas de prueba JWT.
const pruebaRoutes = require("./routes/prueba.routes");

// Importa las rutas de pedidos de los clientes.
const pedidoRoutes = require("./routes/pedido.routes");

// Importa las rutas administrativas.
const adminRoutes = require("./routes/admin.routes");

// Importa las rutas públicas del catálogo.
const productoRoutes = require("./routes/producto.routes");

// Crea la instancia principal de Express.
const app = express();

// Permite acceder públicamente a las imágenes de los productos.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configura el origen autorizado para el frontend.
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Configura CORS.
app.use(cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Permite interpretar solicitudes JSON.
app.use(express.json());

// Ruta para comprobar el estado de la API.
app.get("/api/v1/estado", function (req, res) {
    return res.status(200).json({
        mensaje: "La API de Creaciones & Diseño está funcionando."
    });
});

// Registra las rutas de autenticación.
app.use("/api/v1/auth", authRoutes);

// Registra las rutas de prueba JWT.
app.use("/api/v1/prueba", pruebaRoutes);

// Registra las rutas de pedidos de clientes.
app.use("/api/v1/pedidos", pedidoRoutes);

// Registra las rutas administrativas.
app.use("/api/v1/admin", adminRoutes);

// Registra las rutas públicas del catálogo.
app.use("/api/v1/productos", productoRoutes);

// Gestiona las rutas inexistentes.
app.use(function (req, res) {
    return res.status(404).json({
        mensaje: "La ruta solicitada no existe."
    });
});

// Gestiona los errores de la aplicación.
app.use(function (error, req, res, next) {

    // Detecta errores de formato JSON.
    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud contiene JSON inválido."
        });
    }

    console.error("Error no controlado en la API:", error);

    // Respeta el código HTTP definido por los servicios.
    const estado = error.statusCode || 500;

    return res.status(estado).json({
        mensaje: error.statusCode
            ? error.message
            : "Ocurrió un error interno en el servidor."
    });
});

// Exporta la aplicación.
module.exports = app;

