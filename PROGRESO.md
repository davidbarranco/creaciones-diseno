# PROGRESO GENERAL DEL PROYECTO

## Creaciones & Diseño

**Fecha de actualización:** 29 de octubre de 2026.

---

## 1. Objetivo del proyecto

Desarrollar una aplicación web para Creaciones & Diseño que permita a los clientes consultar productos personalizados, seleccionar características, gestionar sus cuentas y realizar pedidos.

La aplicación contará con un frontend desarrollado con React y un backend desarrollado con Node.js y Express. El backend expondrá una API REST que gestionará la lógica de negocio y la comunicación con la base de datos MySQL mediante Prisma ORM.

El objetivo es construir una aplicación completa, organizada, segura y preparada para ampliarse progresivamente.

## 2. Tecnologías utilizadas

### Backend

* Node.js.
* Express.
* JavaScript.
* Prisma ORM.
* MySQL.
* bcrypt para proteger las contraseñas.
* Zod para validar los datos.
* jsonwebtoken (JWT) para la autenticación.
* dotenv para gestionar las variables de entorno.
* CORS para controlar las solicitudes entre frontend y backend.
* Jest para ejecutar pruebas automatizadas.
* Supertest para probar los endpoints HTTP.

### Frontend

* React.
* Vite.
* HTML.
* CSS.
* JavaScript.

### Herramientas

* Visual Studio Code.
* Git Bash.
* Git y GitHub.
* MySQL.
* Prisma Studio.
* Postman.

### Versiones conocidas

* Node.js: v24.19.0.
* Prisma: 6.19.3.
* Express: 5.3.0.
* Jest: 30.5.2.
* Supertest: 7.3.1.

## 3. Base de datos

La base de datos del proyecto se denomina `creaciones_diseno`.

Se configuró la conexión con MySQL mediante Prisma ORM.

El modelo `Usuario` contempla los siguientes campos:

| Campo         | Función                          |
|---------------|----------------------------------|
| id            | Identificador único del usuario. |
| nombre        | Nombre del usuario.              |
| apellido      | Apellido del usuario.            |
| correo        | Correo electrónico único.        |
| password      | Contraseña almacenada como hash. |
| fechaCreacion | Fecha de creación del registro.  |

La tabla física se denomina `usuarios`.

### Migraciones

Se creó la migración inicial:

`prisma/migrations/20261026211059_crear_tabla_usuarios/migration.sql`

**Estado:** migración aplicada y base de datos sincronizada, según la última comprobación realizada con Prisma.

No es necesario repetir esta comprobación mientras no se produzcan cambios en el esquema o en las migraciones.

## 4. Organización del backend

El backend se encuentra en la carpeta `backend/`.

La estructura utiliza separación por responsabilidades.

### Configuración

`src/config/prisma.js`

Contiene la instancia compartida de PrismaClient.

### Repositorios

`src/repositories/usuario.repository.js`

Gestiona las operaciones de acceso a los datos de los usuarios, incluyendo:

* `buscarPorCorreo`
* `buscarPorId`
* `crearUsuario`

### Validaciones

`src/validators/auth.validator.js`

Utiliza Zod para validar los datos del registro y del inicio de sesión.

### Servicios

`src/services/auth.service.js`

Contiene la lógica de autenticación:

* Registro de usuarios.
* Comprobación de correos duplicados.
* Protección de contraseñas con bcrypt.
* Verificación de credenciales.
* Generación de tokens JWT.

### Controladores

`src/controllers/auth.controller.js`

Gestiona las solicitudes HTTP y las respuestas de autenticación.

### Rutas

`src/routes/auth.routes.js`

Define las rutas de autenticación.

### Middleware

`src/middlewares/auth.middleware.js`

Verifica los tokens JWT antes de permitir el acceso a las rutas protegidas.

### Aplicación y servidor

* `src/app.js`: configura Express, CORS, el procesamiento de JSON, las rutas y el manejo de errores.
* `src/server.js`: inicia el servidor HTTP y establece la conexión con Prisma.

### Pruebas automatizadas

`tests/app.test.js`

Contiene las pruebas automatizadas básicas de la aplicación.

## 5. Registro de usuarios

**Endpoint:**

`POST /api/v1/auth/registro`

El proceso contempla:

1. Recibir los datos del usuario en formato JSON.
2. Validar los datos mediante Zod.
3. Normalizar el correo electrónico.
4. Comprobar si el correo ya está registrado.
5. Proteger la contraseña utilizando bcrypt.
6. Crear el usuario en MySQL mediante Prisma.
7. Devolver una respuesta HTTP.

Se realizaron pruebas manuales mediante Postman.

### Pendiente

Revisar y confirmar los códigos HTTP del registro, incluyendo:

* Registro exitoso.
* Correo electrónico duplicado.
* Datos incompletos o inválidos.

El código HTTP definitivo del registro debe confirmarse antes de dar por cerrado este punto.

## 6. Inicio de sesión

**Endpoint:**

`POST /api/v1/auth/login`

El proceso contempla:

1. Recibir el correo y la contraseña.
2. Validar los datos recibidos.
3. Buscar al usuario en MySQL.
4. Comparar la contraseña recibida con el hash almacenado utilizando bcrypt.
5. Rechazar las credenciales incorrectas.
6. Generar un token JWT cuando la autenticación es correcta.
7. Devolver el token y los datos públicos del usuario.

Se realizaron pruebas manuales mediante Postman para comprobar el inicio de sesión correcto y el rechazo de credenciales incorrectas.

La contraseña nunca debe devolverse en la respuesta de la API.

## 7. Autenticación JWT

Se implementó la autenticación mediante JSON Web Tokens.

La generación del token utiliza:

* La variable de entorno `JWT_SECRET`.
* El algoritmo HS256.
* El identificador del usuario en el campo `sub`.
* Una duración de una hora para el token de acceso.

El token se envía mediante el encabezado HTTP:

`Authorization: Bearer <token>`

La variable `JWT_SECRET` debe mantenerse privada y no debe publicarse en GitHub.

## 8. Middleware de autenticación

Archivo:

`src/middlewares/auth.middleware.js`

El middleware realiza las siguientes comprobaciones:

1. Verifica que exista el encabezado `Authorization`.
2. Comprueba que se utilice el esquema `Bearer`.
3. Extrae el token.
4. Verifica la firma mediante `JWT_SECRET`.
5. Acepta únicamente el algoritmo HS256.
6. Rechaza tokens inválidos o expirados.
7. Comprueba que el token contenga un identificador de usuario válido.
8. Permite continuar cuando la autenticación es satisfactoria.

El middleware guarda la información de autenticación en `req.usuarioAutenticado`.

### Pruebas manuales de seguridad JWT

Se realizaron cuatro pruebas mediante Postman:

| Prueba              | Resultado        | Estado   |
|---------------------|------------------|----------|
| Solicitud sin token | 401 Unauthorized | Aprobada |
| Token alterado      | 401 Unauthorized | Aprobada |
| Token expirado      | 401 Unauthorized | Aprobada |
| Token válido        | 200 OK           | Aprobada |

**Resultado: 4 de 4 pruebas aprobadas.**

Estas pruebas verifican los comportamientos evaluados, pero no constituyen una auditoría completa de seguridad.

## 9. Endpoint protegido de prueba

**Endpoint:**

`GET /api/v1/prueba/protegido`

Permite comprobar el funcionamiento del middleware JWT.

Cuando el token es válido, la API permite el acceso. Cuando falta el token o este es inválido o ha expirado, la API rechaza la solicitud.

## 10. Pruebas automatizadas

Se instalaron Jest y Supertest para comprobar automáticamente algunos comportamientos de la API.

### Archivo de pruebas

`backend/tests/app.test.js`

### Pruebas implementadas

| Prueba                                     | Resultado esperado |
|--------------------------------------------|--------------------|
| Consulta de `GET /api/v1/estado`           | 200 OK             |
| Solicitud a una ruta inexistente           | 404 Not Found      |
| Envío de JSON inválido al inicio de sesión | 400 Bad Request    |

### Último resultado

El comando `npm test` terminó correctamente:

* Suites aprobadas: 1 de 1.
* Pruebas aprobadas: 3 de 3.

**Estado: pruebas automatizadas actuales aprobadas.**

Estas tres pruebas cubren el estado de la API, las rutas inexistentes y el JSON inválido. No representan una cobertura automatizada completa de los procesos de registro, inicio de sesión y autenticación JWT.

### Comando para ejecutar las pruebas

Desde la carpeta `backend`:

`npm test`

## 11. Configuración del servidor y variables de entorno

El proyecto utiliza variables de entorno para configurar el puerto, la conexión con MySQL, la clave JWT y la dirección autorizada del frontend.

Archivos relacionados:

* `backend/.env`: configuración local, excluida de Git.
* `backend/.env.example`: plantilla de ejemplo sin contraseñas reales.

El archivo `.gitignore` excluye `.env` y permite mantener `.env.example` en el repositorio.

No se deben publicar contraseñas de MySQL, claves JWT ni otros secretos.

### Inicio del servidor

Se configuró el comando de inicio en `package.json`:

`npm start`

La última ejecución confirmó que el servidor se inicia en:

`http://localhost:3000`

También se comprobó que el endpoint de estado respondía correctamente:

`GET http://localhost:3000/api/v1/estado`

Respuesta observada:

`{"mensaje":"La API de Creaciones & Diseño está funcionando."}`

## 12. Documentación técnica

Documento de pruebas de seguridad JWT:

`backend/docs/pruebas-seguridad-jwt.md`

Este documento recoge las pruebas realizadas, sus resultados y las recomendaciones relacionadas con la autenticación JWT.

También se mantiene este archivo para registrar el estado general del proyecto, los avances y las tareas pendientes.

## 13. Estado general del desarrollo

### Completado

* Configuración inicial del backend con Node.js y Express.
* Configuración de la conexión con MySQL mediante Prisma.
* Modelo de usuarios.
* Migración inicial de la base de datos.
* Organización del código por capas.
* Repositorio de usuarios.
* Validación de datos mediante Zod.
* Registro de usuarios.
* Protección de contraseñas con bcrypt.
* Inicio de sesión.
* Generación de tokens JWT.
* Middleware de autenticación.
* Endpoint protegido de prueba.
* Pruebas manuales de registro e inicio de sesión.
* Cuatro pruebas manuales de seguridad JWT aprobadas.
* Documento de pruebas de seguridad JWT.
* Configuración del comando `npm start`.
* Plantilla `.env.example` sin credenciales reales.
* Tres pruebas automatizadas aprobadas.
* Verificación del endpoint de estado.
* Manejo básico de rutas inexistentes y JSON inválido.

### Pendiente en el backend

1. Revisar y estandarizar los códigos HTTP del registro.
2. Ampliar las pruebas automatizadas para registro, inicio de sesión y autenticación.
3. Revisar los casos de correo duplicado, datos inválidos y credenciales incorrectas.
4. Revisar el manejo de errores y las respuestas de la API.
5. Evaluar si las rutas protegidas necesitan comprobar el estado actual del usuario en la base de datos.
6. Completar la documentación de los endpoints.
7. Realizar una revisión final de seguridad y configuración antes de un despliegue público.

### Pendiente en el proyecto general

1. Integrar el frontend React con la API.
2. Desarrollar el catálogo de productos.
3. Implementar la personalización de productos.
4. Desarrollar el carrito de compras.
5. Implementar la gestión de pedidos.
6. Crear las funciones administrativas.
7. Incorporar pruebas de integración y funcionales.
8. Preparar el despliegue de la aplicación.

## 14. Estado de Git y GitHub

Repositorio:

`https://github.com/davidbarranco/creaciones-diseno`

Rama de trabajo:

`main`

En la última revisión de Git se encontraron cambios locales pendientes en:

* `PROGRESO.md`
* `backend/.env.example`
* `backend/package.json`
* `backend/package-lock.json`
* `backend/src/app.js`
* `backend/src/server.js`
* `backend/src/services/auth.service.js`
* `backend/tests/`

La rama local estaba sincronizada con `origin/main` antes de registrar estos cambios.

### Pendiente

1. Guardar los cambios con `git add`.
2. Crear el commit correspondiente.
3. Ejecutar `git push origin main`.
4. Confirmar que los cambios estén publicados en GitHub.

No se debe subir el archivo `.env` real.

## 15. Punto exacto donde quedamos

El backend ya cuenta con conexión a MySQL, registro e inicio de sesión, autenticación JWT, un endpoint protegido, configuración de inicio del servidor y pruebas automatizadas básicas.

La migración de la base de datos está aplicada y las tres pruebas automatizadas actuales han pasado.

**La siguiente tarea inmediata es guardar los cambios pendientes de Git, incluido este archivo `PROGRESO.md`, y publicarlos en GitHub.**

Después de confirmar el commit y el push, continuaremos con la revisión de los códigos HTTP del registro de usuarios y avanzaremos hacia la integración del frontend React.

No debemos repetir comprobaciones que ya se realizaron correctamente, salvo que un cambio posterior las haga necesarias.

## 16. Forma de trabajo

Para continuar el desarrollo:

1. Trabajar en un paso a la vez.
2. Explicar qué se va a hacer y por qué.
3. Indicar la ruta exacta del archivo.
4. Proporcionar el código completo cuando sea necesario.
5. Ejecutar las pruebas necesarias para verificar cada cambio.
6. Esperar la confirmación del resultado antes de avanzar.
7. Mantener los comentarios del código en español.
8. No publicar contraseñas, tokens ni claves secretas.
9. Evitar repetir revisiones que ya se completaron.
10. Actualizar este archivo cuando se termine una fase importante.























# PROGRESO DEL FRONTEND – CREACIONES & DISEÑO

## 1. Tecnologías utilizadas

* React 19.
* Vite 8.
* JavaScript.
* HTML5.
* CSS3.
* React Router DOM.
* API REST desarrollada con Node.js y Express.
* JWT para autenticación.
* MySQL para almacenamiento de información.

## 2. Estructura del proyecto

Se organizó el frontend con una estructura modular para separar responsabilidades:

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── services/
    ├── context/
    ├── routes/
    ├── hooks/
    ├── utils/
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── main.jsx
```

## 3. Funcionalidades desarrolladas

### 3.1. Configuración y conexión con el backend

* Configuración de la URL de la API mediante variables de entorno en `.env`.
* Conexión del frontend con el backend utilizando `fetch`.
* Comunicación con los endpoints de autenticación y pedidos.

### 3.2. Autenticación de usuarios

Se implementaron las siguientes funcionalidades:

* Registro de usuarios.
* Inicio de sesión.
* Almacenamiento del token JWT en `localStorage`.
* Almacenamiento de información del usuario.
* Cierre de sesión.
* Manejo del estado de autenticación mediante `AuthContext`.
* Protección de rutas mediante `ProtectedRoute`.
* Visualización dinámica de opciones en el encabezado según el estado de autenticación.

Archivos principales:

* `services/auth.service.js`
* `context/AuthContext.jsx`
* `pages/Registro.jsx`
* `pages/Login.jsx`
* `pages/MiCuenta.jsx`
* `routes/ProtectedRoute.jsx`

### 3.3. Catálogo de productos

Se implementó un catálogo inicial con productos de ejemplo:

* Camiseta personalizada.
* Mug personalizado.
* Camiseta básica.
* Productos decorativos.

Cada producto contiene:

* Identificador.
* Nombre.
* Categoría.
* Precio.
* Imagen.

Por ahora, los productos se encuentran definidos estáticamente en el frontend.

### 3.4. Carrito de compras

Se desarrolló un carrito utilizando `CarritoContext.jsx`.

Funcionalidades implementadas:

* Agregar productos.
* Aumentar cantidades.
* Disminuir cantidades.
* Eliminar productos.
* Vaciar el carrito.
* Calcular el total de productos.
* Calcular el valor total de la compra.
* Persistencia del carrito mediante `localStorage`.

Archivo principal:

* `context/CarritoContext.jsx`
* `pages/Carrito.jsx`

### 3.5. Finalización de compra

Se desarrolló la página `FinalizarCompra.jsx`.

Incluye un formulario con los siguientes datos:

* Nombre.
* Apellido.
* Correo electrónico.
* Teléfono.
* Dirección.
* Ciudad.
* Departamento.
* Indicaciones adicionales.

También incluye:

* Carga automática de los datos del usuario autenticado.
* Validación de campos obligatorios.
* Resumen de los productos del carrito.
* Cálculo del total de la compra.
* Envío de la información al backend.
* Envío del token JWT mediante el encabezado `Authorization`.
* Visualización de errores durante el proceso.
* Limpieza del carrito después de registrar correctamente el pedido.
* Redirección a la página principal después de finalizar la compra.

## 4. Integración con el backend

Se conectó el formulario de finalización de compra con el endpoint:

```http
POST /api/v1/pedidos
```

El frontend envía:

* Datos de entrega del cliente.
* Identificadores de los productos.
* Cantidades seleccionadas.
* Token JWT del usuario autenticado.

El backend se encarga de validar los productos, consultar sus precios oficiales, calcular los subtotales y el total, y guardar la información en MySQL mediante Prisma.

## 5. Pruebas realizadas

Se realizaron pruebas desde la aplicación web:

* Registro de usuarios.
* Inicio de sesión.
* Persistencia de la sesión.
* Agregar productos al carrito.
* Modificar cantidades.
* Eliminar productos.
* Calcular el total de la compra.
* Completar el formulario de entrega.
* Enviar el pedido al backend.
* Registrar correctamente el pedido en MySQL.
* Verificar los registros mediante Prisma Studio.

Se confirmó que los pedidos se almacenan correctamente en las tablas:

* `Pedido`
* `DetallePedido`

## 6. Estado actual del frontend

| Funcionalidad                 | Estado               |
|-------------------------------|----------------------|
| Configuración de React y Vite | Completado           |
| Estructura modular            | Completado           |
| Conexión con el backend       | Completado           |
| Registro de usuarios          | Completado           |
| Inicio de sesión              | Completado           |
| Autenticación JWT             | Completado           |
| Protección de rutas           | Completado           |
| Catálogo inicial              | Completado           |
| Carrito de compras            | Completado           |
| Finalización de compra        | Completado           |
| Registro de pedidos en MySQL  | Completado y probado |

## 7. Próximas tareas pendientes

Continuar el desarrollo con las siguientes funcionalidades:

1. Desarrollar el historial de pedidos en la sección «Mi cuenta».
2. Crear la consulta de pedidos del usuario autenticado.
3. Mostrar el detalle de cada pedido.
4. Mostrar el estado de cada pedido.
5. Conectar el catálogo del frontend con una API de productos.
6. Desarrollar la administración de productos.
7. Mejorar y completar el diseño visual de la tienda.
8. Implementar las funcionalidades restantes del ecommerce.

## 8. Punto exacto donde quedó el desarrollo

El frontend ya permite que un usuario se registre, inicie sesión, agregue productos al carrito, complete sus datos de entrega y realice una compra.

El pedido se envía correctamente al backend, se procesa mediante la arquitectura por capas y se almacena en MySQL.

La información fue verificada mediante Prisma Studio.

**Próximo paso al retomar:** desarrollar el historial de pedidos dentro de «Mi cuenta», permitiendo que cada usuario consulte únicamente sus propias compras.

