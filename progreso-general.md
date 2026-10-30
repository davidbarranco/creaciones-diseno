# CREACIONES & DISEÑO

## DOCUMENTACIÓN GENERAL DEL PROYECTO

**Archivo:** progreso_general.md
**Tipo de proyecto:** Aplicación web de comercio electrónico (E-commerce).
**Estado:** En desarrollo.
**Enfoque actual:** Backend y frontend integrados.
**Última actualización:** 30 de octubre de 2026.

---

# 1. DESCRIPCIÓN DEL PROYECTO

Creaciones & Diseño es una aplicación web de comercio electrónico orientada a la venta de productos personalizados.

### Productos que ofrecerá

* Camisetas personalizadas.
* Camisetas básicas.
* Mugs personalizados.
* Vinilos y adhesivos.
* Productos decorativos.
* Artículos publicitarios.
* Otros productos personalizados.

### Objetivo

Desarrollar una aplicación web profesional que permita:

* Registrar usuarios.
* Iniciar y cerrar sesión.
* Consultar productos.
* Agregar productos al carrito.
* Realizar compras.
* Registrar pedidos.
* Consultar el historial de compras.
* Administrar productos.
* Administrar pedidos.
* Gestionar la información de los clientes.

La aplicación debe contar con frontend, backend, API REST y base de datos relacional.

---

# 2. TECNOLOGÍAS UTILIZADAS

## Frontend

| Tecnología       | Utilización                            |
|------------------|----------------------------------------|
| React 19         | Construcción de interfaces             |
| Vite 8           | Herramienta de desarrollo              |
| JavaScript       | Lógica de la aplicación                |
| HTML5            | Estructura                             |
| CSS3             | Diseño y estilos                       |
| React Router DOM | Navegación entre páginas               |
| Context API      | Estado global                          |
| Fetch API        | Comunicación con el backend            |
| localStorage     | Persistencia local de sesión y carrito |

## Backend

| Tecnología     | Utilización                 |
|----------------|-----------------------------|
| Node.js        | Entorno de ejecución        |
| Express 5      | Servidor y API REST         |
| JavaScript     | Lógica del servidor         |
| Prisma 6.19.3  | ORM                         |
| MySQL          | Base de datos               |
| bcrypt         | Encriptación de contraseñas |
| JSON Web Token | Autenticación               |
| Zod            | Validación de datos         |
| Jest           | Pruebas automatizadas       |
| Supertest      | Pruebas HTTP                |

## Herramientas

* Visual Studio Code.
* Git.
* GitHub.
* Git Bash.
* Postman.
* Prisma Studio.
* MySQL.

### Versiones conocidas

* Node.js: v24.19.0.
* Prisma: 6.19.3.
* JWT: jsonwebtoken 9.0.3.
* JavaScript: CommonJS en el backend.

---

# 3. REPOSITORIO Y UBICACIÓN

### Repositorio local

```text
~/OneDrive/Documentos/javascript/creacionesydiseno
```

### GitHub

```text
https://github.com/davidbarranco/creaciones-diseno
```

### Rama de trabajo

```text
main
```

### Estructura general

```text
creacionesydiseno/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── progreso_general.md
└── README.md
```

---

# 4. ESTADO DEL BACKEND

## 4.1. Arquitectura

Se implementó una arquitectura por capas para separar las responsabilidades del sistema.

```text
backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── catalog/
│   │   └── productos.js
│   │
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── prueba.controller.js
│   │   └── pedido.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── repositories/
│   │   ├── usuario.repository.js
│   │   └── pedido.repository.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── prueba.routes.js
│   │   └── pedido.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── pedido.service.js
│   │
│   ├── validators/
│   │   └── auth.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── app.test.js
│
├── .env
├── .env.example
└── package.json
```

## 4.2. Configuración del servidor

Se creó el servidor utilizando Express.

Puerto:

```text
http://localhost:3000
```

El archivo `server.js` inicia el servidor y `app.js` configura Express, los middlewares y las rutas.

El backend tiene configurado CORS para permitir la comunicación con el frontend.

Origen de desarrollo:

```text
http://localhost:5173
```

## 4.3. Conexión con MySQL

Base de datos:

```text
creaciones_diseno
```

Se utiliza Prisma como ORM para interactuar con MySQL.

Archivo principal:

```text
backend/prisma/schema.prisma
```

Configuración de conexión:

```text
backend/src/config/prisma.js
```

Se utiliza Prisma Studio para visualizar y verificar los registros.

Dirección:

```text
http://localhost:5555
```

## 4.4. Autenticación de usuarios

Se implementó el sistema de registro e inicio de sesión.

### Registro

* Validación de datos con Zod.
* Normalización del correo electrónico.
* Verificación de correos duplicados.
* Encriptación de contraseñas con bcrypt.
* Almacenamiento del usuario mediante Prisma.

### Inicio de sesión

* Búsqueda del usuario por correo.
* Comparación de contraseña mediante bcrypt.
* Generación de token JWT.
* Retorno de información del usuario autenticado.

### JWT

Se implementó autenticación mediante JSON Web Token.

Configuración:

* Algoritmo HS256.
* Identificador del usuario en `sub`.
* Expiración de una hora.
* Secreto almacenado en `JWT_SECRET` dentro de `.env`.

El middleware `auth.middleware.js` verifica:

* Existencia del token.
* Firma del token.
* Algoritmo permitido.
* Expiración.
* Identificador del usuario.

El usuario autenticado queda disponible en:

```javascript
req.usuarioAutenticado = {
    id: datosToken.sub
};
```

Importante: el identificador del token se convierte a número cuando se utiliza para consultar o registrar información en Prisma.

## 4.5. Sistema de pedidos

Se desarrolló el registro de pedidos desde el frontend hasta MySQL.

### Archivos implementados

```text
src/
├── catalog/
│   └── productos.js
│
├── controllers/
│   └── pedido.controller.js
│
├── repositories/
│   └── pedido.repository.js
│
├── routes/
│   └── pedido.routes.js
│
└── services/
    └── pedido.service.js
```

### Funcionamiento

1. El usuario agrega productos al carrito.
2. Completa los datos de entrega.
3. El frontend envía los datos a la API.
4. El backend verifica el token JWT.
5. El servicio valida los productos y las cantidades.
6. El backend consulta los precios oficiales del catálogo.
7. Calcula los subtotales y el total.
8. El repositorio registra el pedido y sus detalles en MySQL.

El backend no confía en los precios enviados por el navegador.

### Catálogo temporal

Actualmente existe un catálogo estático en:

```text
src/catalog/productos.js
```

Los productos están definidos directamente en el código del backend.

Este catálogo deberá reemplazarse posteriormente por una gestión de productos conectada a la base de datos.

---

# 5. ENDPOINTS IMPLEMENTADOS

Dirección base:

```text
http://localhost:3000/api/v1
```

| Método | Endpoint            | Función                            |
|--------|---------------------|------------------------------------|
| GET    | `/estado`           | Comprobar funcionamiento de la API |
| POST   | `/auth/registro`    | Registrar usuario                  |
| POST   | `/auth/login`       | Iniciar sesión                     |
| GET    | `/prueba/protegido` | Comprobar ruta protegida           |
| POST   | `/pedidos`          | Registrar un pedido                |

### Ejemplo de autenticación

Las rutas protegidas reciben el token mediante:

```http
Authorization: Bearer TOKEN_JWT
```

### Endpoint de pedidos

```http
POST /api/v1/pedidos
```

Recibe:

* Datos de entrega.
* Productos.
* Identificadores.
* Cantidades.

El usuario se identifica mediante el token JWT.

---

# 6. BASE DE DATOS

Se utiliza MySQL con Prisma.

## 6.1. Modelo Usuario

Tabla:

```text
usuarios
```

Campos:

* id.
* nombre.
* apellido.
* correo.
* password.
* fechaCreacion.

Relación:

Un usuario puede tener varios pedidos.

## 6.2. Modelo Pedido

Tabla:

```text
pedidos
```

Campos:

* id.
* usuarioId.
* nombre.
* apellido.
* correo.
* telefono.
* direccion.
* ciudad.
* departamento.
* indicaciones.
* total.
* estado.
* fechaCreacion.

Relaciones:

* Pertenece a un usuario.
* Tiene varios detalles de pedido.

## 6.3. Modelo DetallePedido

Tabla:

```text
detalles_pedido
```

Campos:

* id.
* pedidoId.
* productoId.
* nombreProducto.
* precio.
* cantidad.
* subtotal.

Relación:

Cada detalle pertenece a un pedido.

## 6.4. Relaciones

```text
USUARIO
   |
   | 1:N
   |
PEDIDOS
   |
   | 1:N
   |
DETALLES_PEDIDO
```

### Migraciones

Se crearon y aplicaron migraciones para:

* Tabla de usuarios.
* Tablas de pedidos y detalles de pedidos.

Migración de pedidos:

```text
20261030180801_crear_tablas_pedidos
```

---

# 7. PRUEBAS REALIZADAS EN EL BACKEND

Se realizaron pruebas mediante Postman y Jest/Supertest.

### Autenticación

* Registro de usuario.
* Inicio de sesión.
* Contraseña incorrecta.
* Token válido.
* Token alterado.
* Token expirado.
* Acceso a rutas protegidas.

### Pruebas automatizadas

Archivo:

```text
backend/tests/app.test.js
```

Estado conocido:

* 1 suite de pruebas.
* 3 pruebas.
* Pruebas de estado de la API, respuesta 404 y JSON inválido.

### Pedidos

Se comprobó:

* Registro de pedido.
* Asociación del pedido con el usuario.
* Registro de detalles.
* Cantidades.
* Precios.
* Total de la compra.

La verificación se realizó desde Prisma Studio.

---

# 8. ESTADO DEL FRONTEND

## 8.1. Estructura

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

## 8.2. Configuración de conexión con el backend

Archivo:

```text
frontend/.env
```

Contenido:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Se utiliza `import.meta.env.VITE_API_URL` para construir las direcciones de las solicitudes.

Importante: cuando se modifica este archivo se debe reiniciar el servidor de Vite.

## 8.3. Autenticación

Archivos principales:

```text
src/services/auth.service.js
src/context/AuthContext.jsx
src/pages/Registro.jsx
src/pages/Login.jsx
src/pages/MiCuenta.jsx
```

Funcionalidades:

* Registro de usuarios.
* Inicio de sesión.
* Almacenamiento del token JWT en localStorage.
* Almacenamiento de información del usuario.
* Cierre de sesión.
* Control global de autenticación.
* Navegación según el estado del usuario.

## 8.4. Protección de rutas

Archivo:

```text
src/routes/ProtectedRoute.jsx
```

Se implementó protección de rutas para restringir el acceso a páginas que requieren autenticación.

La navegación se organiza mediante:

```text
src/routes/AppRouter.jsx
```

## 8.5. Catálogo de productos

Se creó un catálogo inicial de productos estáticos.

Productos:

* Camiseta personalizada.
* Mug personalizado.
* Camiseta básica.
* Productos decorativos.

Cada producto contiene:

* id.
* nombre.
* categoría.
* precio.
* imagen.

Por ahora, los productos están definidos en el frontend y todavía no se consultan desde una API de productos.

## 8.6. Carrito de compras

Archivo principal:

```text
src/context/CarritoContext.jsx
```

Página:

```text
src/pages/Carrito.jsx
```

Funcionalidades:

* Agregar productos.
* Aumentar cantidades.
* Disminuir cantidades.
* Eliminar productos.
* Vaciar carrito.
* Calcular cantidad total de productos.
* Calcular valor total.
* Guardar el carrito en localStorage.

El contexto global se conecta desde:

```text
src/main.jsx
```

## 8.7. Finalización de compra

Archivo:

```text
src/pages/FinalizarCompra.jsx
```

Formulario implementado:

* Nombre.
* Apellido.
* Correo.
* Teléfono.
* Dirección.
* Ciudad.
* Departamento.
* Indicaciones.

Funcionalidades:

* Recuperación de información del usuario autenticado.
* Validación de campos obligatorios.
* Resumen de productos.
* Cálculo del total.
* Envío del pedido al backend.
* Envío del token JWT.
* Manejo de errores.
* Estado de procesamiento.
* Limpieza del carrito después de registrar correctamente el pedido.
* Redirección a la página principal.

### Integración

El frontend utiliza:

```http
POST /api/v1/pedidos
```

Envía los datos de entrega y los productos con sus identificadores y cantidades.

El backend realiza los cálculos y almacena la información.

---

# 9. PRUEBA COMPLETA DEL E-COMMERCE

Se realizó una prueba desde la aplicación web.

Flujo comprobado:

```text
USUARIO
   |
   v
REGISTRO
   |
   v
INICIO DE SESIÓN
   |
   v
CATÁLOGO DE PRODUCTOS
   |
   v
AGREGAR AL CARRITO
   |
   v
MODIFICAR CANTIDADES
   |
   v
FINALIZAR COMPRA
   |
   v
FORMULARIO DE ENTREGA
   |
   v
ENVÍO A LA API
   |
   v
VALIDACIÓN JWT
   |
   v
SERVICIO DE PEDIDOS
   |
   v
REPOSITORIO PRISMA
   |
   v
BASE DE DATOS MYSQL
```

### Resultado

La prueba fue exitosa.

Se confirmó que:

* El usuario puede realizar una compra.
* El frontend envía correctamente la información.
* El backend recibe y procesa el pedido.
* Los pedidos quedan almacenados en MySQL.
* Los detalles de los productos quedan asociados al pedido.
* La información puede visualizarse desde Prisma Studio.

**La creación y persistencia de pedidos ya está implementada y probada.**

---

# 10. CÓMO EJECUTAR EL PROYECTO

Se deben utilizar dos terminales independientes.

## Terminal 1: Backend

Abrir Git Bash y ejecutar:

```bash
cd ~/OneDrive/Documentos/javascript/creacionesydiseno/backend
```

Iniciar:

```bash
npm start
```

Servidor:

```text
http://localhost:3000
```

## Terminal 2: Frontend

Abrir otra terminal y ejecutar:

```bash
cd ~/OneDrive/Documentos/javascript/creacionesydiseno/frontend
```

Iniciar:

```bash
npm run dev
```

Dirección habitual:

```text
http://localhost:5173
```

## Prisma Studio

Desde la carpeta backend:

```bash
npx prisma studio
```

Dirección:

```text
http://localhost:5555
```

---

# 11. SEGURIDAD Y VARIABLES DE ENTORNO

El backend utiliza:

```text
backend/.env
```

Contiene variables sensibles como:

* DATABASE_URL.
* JWT_SECRET.
* Otras configuraciones necesarias para el servidor.

El archivo `.env` no debe subirse a GitHub.

Se creó:

```text
backend/.env.example
```

Este archivo sirve como plantilla para que otra persona pueda configurar las variables necesarias en su equipo.

El frontend utiliza:

```text
frontend/.env
```

Contiene la URL de la API.

No se deben guardar contraseñas, secretos JWT ni credenciales privadas en variables `VITE_`, porque estas pueden quedar expuestas en el navegador.

---

# 12. ESTADO GENERAL DEL PROYECTO

| Componente                           | Estado                           |
|--------------------------------------|----------------------------------|
| Configuración del proyecto           | Completado                       |
| Configuración de Node.js             | Completado                       |
| Configuración de Express             | Completado                       |
| Conexión MySQL                       | Completado                       |
| Configuración Prisma                 | Completado                       |
| Arquitectura por capas               | Implementada                     |
| Registro de usuarios                 | Implementado y probado           |
| Inicio de sesión                     | Implementado y probado           |
| JWT                                  | Implementado y probado           |
| Middleware de autenticación          | Implementado y probado           |
| API REST de autenticación            | Implementada                     |
| Modelo de pedidos                    | Implementado                     |
| Modelo de detalles de pedidos        | Implementado                     |
| Registro de pedidos                  | Implementado y probado           |
| Frontend React                       | Implementado                     |
| Registro e inicio de sesión frontend | Implementados                    |
| Protección de rutas                  | Implementada                     |
| Catálogo inicial                     | Implementado con datos estáticos |
| Carrito                              | Implementado                     |
| Finalización de compra               | Implementada                     |
| Conexión frontend-backend            | Implementada                     |
| Persistencia de pedidos en MySQL     | Comprobada                       |

---

# 13. TAREAS PENDIENTES

## PRIORIDAD 1. Historial de pedidos

Próximo objetivo al retomar el desarrollo.

### Backend

* Crear endpoint para consultar los pedidos del usuario autenticado.
* Consultar los pedidos mediante su `usuarioId`.
* Incluir los detalles de cada pedido.
* Proteger el endpoint mediante JWT.
* Evitar que un usuario pueda consultar pedidos de otra persona.

### Frontend

* Crear o completar la sección «Mi cuenta».
* Mostrar el historial de compras.
* Mostrar número del pedido.
* Mostrar fecha.
* Mostrar total.
* Mostrar estado.
* Permitir consultar el detalle de cada pedido.

## PRIORIDAD 2. API de productos

Actualmente el catálogo es estático.

Pendiente:

* Crear modelo Producto en Prisma.
* Crear tabla de productos.
* Crear endpoints de productos.
* Consultar productos desde el frontend.
* Dejar de depender de los productos definidos manualmente en el código.

## PRIORIDAD 3. Administración

Desarrollar funcionalidades administrativas:

* Crear productos.
* Editar productos.
* Eliminar o desactivar productos.
* Consultar pedidos.
* Actualizar estados de pedidos.
* Administrar usuarios y permisos.

## PRIORIDAD 4. Mejoras del ecommerce

* Mejorar diseño visual.
* Implementar filtros por categoría.
* Implementar búsqueda de productos.
* Implementar imágenes de productos.
* Mejorar validaciones.
* Mejorar manejo de errores.
* Implementar pasarela de pagos cuando corresponda.
* Implementar funcionalidades adicionales de gestión.

---

# 14. REGLAS PARA CONTINUAR EL DESARROLLO

Para mantener una buena organización:

1. Trabajar paso a paso.
2. No adelantar varias funcionalidades sin terminar y probar la actual.
3. Explicar qué hace cada archivo y cuál es su responsabilidad.
4. Mantener la arquitectura por capas.
5. No mezclar lógica de negocio con controladores.
6. No colocar consultas Prisma directamente en las rutas.
7. Mantener validaciones de entrada.
8. Proteger las rutas privadas mediante JWT.
9. No confiar en precios enviados desde el frontend.
10. Probar cada funcionalidad antes de continuar.
11. Utilizar comentarios pertinentes en español, sin comentar cada línea.
12. Entregar código completo cuando sea necesario reemplazar un archivo.
13. Indicar claramente la ruta del archivo que se debe modificar.
14. Explicar los comandos de Git Bash y desde qué carpeta ejecutarlos.
15. Mantener actualizado este documento y los archivos de progreso específicos.

---

# 15. DOCUMENTACIÓN COMPLEMENTARIA

El proyecto debe mantener separados los documentos de seguimiento:

```text
creacionesydiseno/
│
├── progreso_general.md
│
├── backend/
│   └── progreso.md
│
└── frontend/
    └── progreso.md
```

### Función de cada documento

**progreso_general.md**

Contiene:

* Descripción general.
* Tecnologías.
* Arquitectura.
* Estado general.
* Integración entre frontend y backend.
* Próximos objetivos.

**backend/progreso.md**

Contiene:

* Estructura del backend.
* Archivos desarrollados.
* Endpoints.
* Modelos Prisma.
* Migraciones.
* Autenticación.
* Servicios y repositorios.
* Pruebas.
* Tareas pendientes del backend.

**frontend/progreso.md**

Contiene:

* Estructura React.
* Componentes y páginas.
* Contextos.
* Rutas.
* Autenticación.
* Carrito.
* Finalización de compra.
* Integración con la API.
* Tareas pendientes del frontend.

---

# 16. INSTRUCCIONES PARA RETOMAR EL PROYECTO

Cuando se inicie una nueva sesión de ChatGPT, utilizar este documento como referencia principal.

También compartir los documentos específicos del backend o frontend según el área que se vaya a trabajar.

### CONTEXTO ACTUAL PARA LA SIGUIENTE SESIÓN

El proyecto Creaciones & Diseño ya cuenta con:

* Backend Node.js y Express.
* API REST.
* Base de datos MySQL.
* Prisma ORM.
* Registro e inicio de sesión.
* Autenticación JWT.
* Protección de rutas.
* Catálogo inicial.
* Carrito de compras.
* Formulario de finalización de compra.
* Integración entre frontend y backend.
* Registro de pedidos en MySQL.

La creación de pedidos fue probada desde la aplicación web y verificada mediante Prisma Studio.

**NO ES NECESARIO VOLVER A DESARROLLAR ESTAS FUNCIONALIDADES.**

### PRÓXIMO PASO EXACTO

Continuar con el desarrollo del historial de pedidos.

Primero trabajar en el backend:

1. Revisar el repositorio de pedidos existente.
2. Implementar la consulta de pedidos por usuario autenticado.
3. Crear el endpoint correspondiente.
4. Probarlo con Postman.
5. Después conectar el endpoint con la página «Mi cuenta» del frontend.

Mantener la arquitectura y las convenciones que ya están implementadas.

**Objetivo:** continuar el proyecto desde el estado real en que quedó, sin repetir funcionalidades terminadas.
