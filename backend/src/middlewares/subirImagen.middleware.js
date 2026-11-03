

const multer = require("multer");
const path = require("path");

// Configurar dónde y con qué nombre se guardarán las imágenes.
const almacenamiento = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "../../uploads"));
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `producto-${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        callback(null, nombreUnico);
    }
});

// Validar que el archivo sea una imagen.
function validarImagen(req, file, callback) {
    const extensionesPermitidas = [".jpg", ".jpeg", ".png", ".webp"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (extensionesPermitidas.includes(extension)) {
        callback(null, true);
    } else {
        callback(new Error("Formato no permitido. Utiliza JPG, JPEG, PNG o WEBP."));
    }
}

// Configurar Multer.
const subirImagen = multer({
    storage: almacenamiento,
    fileFilter: validarImagen,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = subirImagen;