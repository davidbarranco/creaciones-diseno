
// Importa Supertest para realizar solicitudes HTTP.
const request = require("supertest");

// Importa la aplicación Express.
const app = require("../src/app");

// Agrupa las pruebas del endpoint de estado.
describe("GET /api/v1/estado", function () {

    // Verifica que la API responda correctamente.
    test("debe responder con estado 200 y un mensaje de funcionamiento", async function () {

        // Envía una solicitud GET al endpoint.
        const respuesta = await request(app)
            .get("/api/v1/estado");

        // Verifica el código HTTP.
        expect(respuesta.status).toBe(200);

        // Verifica el contenido de la respuesta.
        expect(respuesta.body).toEqual({
            mensaje: "La API de Creaciones & Diseño está funcionando."
        });
    });
});

// Agrupa las pruebas de rutas inexistentes.
describe("Manejo de rutas inexistentes", function () {

    // Verifica que una ruta que no existe devuelva un error 404.
    test("debe responder con estado 404 cuando la ruta no existe", async function () {

        // Solicita una ruta que no está definida en la API.
        const respuesta = await request(app)
            .get("/api/v1/ruta-inexistente");

        // Verifica el código HTTP.
        expect(respuesta.status).toBe(404);

        // Verifica el mensaje de error.
        expect(respuesta.body).toEqual({
            mensaje: "La ruta solicitada no existe."
        });
    });
});

// Agrupa las pruebas de errores de solicitudes.
describe("Manejo de JSON inválido", function () {

    // Verifica que la API rechace un cuerpo JSON mal formado.
    test("debe responder con estado 400 cuando el JSON es inválido", async function () {

        // Envía un cuerpo JSON incompleto.
        const respuesta = await request(app)
            .post("/api/v1/auth/login")
            .set("Content-Type", "application/json")
            .send('{"correo":');

        // Verifica el código HTTP.
        expect(respuesta.status).toBe(400);

        // Verifica el mensaje de error.
        expect(respuesta.body).toEqual({
            mensaje: "El cuerpo de la solicitud contiene JSON inválido."
        });
    });
});

