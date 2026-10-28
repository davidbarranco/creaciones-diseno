# PROGRESO GENERAL DEL PROYECTO

## Creaciones & Diseño

**Fecha de actualización:** 28 de octubre de 2026.

---

## 1. Objetivo del proyecto

Desarrollar una aplicación web para Creaciones & Diseño que permita a los clientes consultar productos personalizados, seleccionar características de los productos, realizar pedidos y gestionar sus cuentas.

La aplicación contará con un frontend desarrollado con React y un backend que proporcionará una API REST para gestionar la lógica de negocio y la comunicación con la base de datos.

El objetivo es construir una aplicación completa, organizada, segura y preparada para ampliarse progresivamente.

## 2. Tecnologías utilizadas

### Backend

* Node.js.
* Express.
* JavaScript.
* Prisma ORM.
* MySQL.
* bcrypt para proteger las contraseñas.
* Zod para validar los datos recibidos.
* jsonwebtoken (JWT) para la autenticación.
* dotenv para gestionar variables de entorno.
* CORS para controlar las solicitudes entre el frontend y el backend.

### Frontend

* React.
* Vite.
* HTML.
* CSS.
* JavaScript.

### Herramientas

* Visual Studio Code.
* Git Bash.
* MySQL.
* Prisma Studio.
* Postman.
* GitHub.

### Versiones conocidas

* Node.js: v24.19.0.
* Prisma: 6.19.3.
* Express: 5.3.0.
* jsonwebtoken: 9.0.3.
* Zod: 4.6.7.

---

## 3. Base de datos

Se configuró el acceso a MySQL mediante Prisma ORM.

La base de datos del proyecto se denomina `creaciones_diseno`.

El modelo `Usuario` contiene los siguientes campos:

| Campo         | Función                          |
| ------------- | -------------------------------- |
| id            | Identificador único del usuario. |
| nombre        | Nombre del usuario.              |
| apellido      | Apellido del usuario.            |
| correo        | Correo electrónico único.        |
| password      | Contraseña almacenada como hash. |
| fechaCreacion | Fecha de creación del registro.  |

La tabla física se denomina `usuarios`.

Se utiliza Prisma para realizar las operaciones de consulta, creación y búsqueda de usuarios.

---

## 4. Organización del backend

El backend está organizado por responsabilidades para facilitar el mantenimiento y la ampliación del proyecto.

### Configuración

`src/config/prisma.js`

Contiene la instancia compartida de PrismaClient para acceder a la base de datos.

### Repositorios

`src/repositories/usuario.repository.js`

Contiene las operaciones de acceso a los datos del usuario, incluyendo:

* `buscarPorCorreo`
* `buscarPorId`
* `crearUsuario`

### Validaciones

`src/validators/auth.validator.js`

Utiliza Zod para validar los datos recibidos durante el registro y el inicio de sesión.

### Servicios

`src/services/auth.service.js`

Contiene la lógica de negocio relacionada con:

* Registro de usuarios.
* Protección de contraseñas con bcrypt.
* Verificación de credenciales.
* Generación de tokens JWT.

### Controladores

`src/controllers/auth.controller.js`

Gestiona las solicitudes HTTP y las respuestas correspondientes al registro y al inicio de sesión.

### Rutas

`src/routes/auth.routes.js`

Define los endpoints de autenticación.

### Middleware

`src/middlewares/auth.middleware.js`

Verifica los tokens JWT antes de permitir el acceso a las rutas protegidas.

### Aplicación y servidor

* `src/app.js`: configura Express, CORS, JSON y las rutas.
* `src/server.js`: inicia el servidor HTTP.

También se crearon componentes adicionales para probar el acceso a recursos protegidos.

---

## 5. Registro de usuarios

Se implementó el endpoint:

`POST /api/v1/auth/registro`

Su función es registrar nuevos usuarios.

El proceso contempla:

1. Recibir los datos enviados en formato JSON.
2. Validar los datos mediante Zod.
3. Normalizar el correo electrónico.
4. Comprobar si el correo ya está registrado.
5. Proteger la contraseña utilizando bcrypt.
6. Crear el usuario en MySQL mediante Prisma.
7. Devolver una respuesta HTTP al cliente.

Se realizaron pruebas de registro mediante Postman.

Se comprobó que la API responde correctamente al registrar un usuario de prueba.

**Pendiente de revisión:** confirmar el código HTTP definitivo del registro. La última respuesta observada fue `200 OK`; conviene revisar el controlador para establecer y documentar el código esperado, preferiblemente `201 Created` cuando se crea un recurso nuevo.

También deben mantenerse pruebas específicas para correos duplicados y datos inválidos.

---

## 6. Inicio de sesión

Se implementó el endpoint:

`POST /api/v1/auth/login`

Su función es autenticar a un usuario registrado.

El proceso contempla:

1. Recibir el correo y la contraseña.
2. Validar los datos.
3. Buscar el usuario en la base de datos.
4. Comparar la contraseña recibida con el hash almacenado utilizando bcrypt.
5. Rechazar las credenciales incorrectas.
6. Generar un token JWT cuando la autenticación es correcta.
7. Devolver el token y los datos públicos del usuario.

Se realizaron pruebas mediante Postman.

Se comprobó que un usuario registrado puede iniciar sesión y obtener un token JWT.

La contraseña no debe devolverse en la respuesta.

---

## 7. Autenticación JWT

Se configuró JWT para identificar a los usuarios autenticados y proteger las rutas que requieren autorización.

La generación del token utiliza:

* La variable de entorno `JWT_SECRET`.
* El algoritmo HS256.
* El identificador del usuario en el campo `sub`.
* Una duración de una hora para el token de acceso.

La respuesta de inicio de sesión incluye el token y su información de uso.

El token se envía mediante el encabezado HTTP:

`Authorization: Bearer <token>`

La variable `JWT_SECRET` debe mantenerse privada y nunca debe publicarse en el repositorio.

---

## 8. Middleware de autenticación

Se implementó el archivo:

`src/middlewares/auth.middleware.js`

Este middleware realiza las siguientes comprobaciones:

1. Verifica que exista el encabezado `Authorization`.
2. Comprueba que el esquema de autenticación sea `Bearer`.
3. Extrae el token de la solicitud.
4. Comprueba que el token no esté vacío.
5. Verifica la firma del token utilizando `JWT_SECRET`.
6. Acepta únicamente el algoritmo configurado HS256.
7. Comprueba que el token no haya expirado.
8. Verifica que el token contenga un identificador de usuario válido.
9. Permite continuar cuando la autenticación es satisfactoria.

Si falta el token, es inválido o ha expirado, el middleware responde con un error de autenticación.

El middleware guarda el identificador del usuario autenticado en:

`req.usuarioAutenticado.id`

Esto permite que el controlador de una ruta protegida pueda consultar ese identificador.

**Limitación actual:** el middleware verifica el token, pero no comprueba por sí mismo si el usuario continúa existiendo o está habilitado en MySQL. Esa validación deberá incorporarse cuando corresponda a las necesidades de autorización de la aplicación.

---

## 9. Endpoint protegido de prueba

Se creó el endpoint:

`GET /api/v1/prueba/protegido`

Su objetivo es comprobar el funcionamiento del middleware JWT.

Los archivos involucrados son:

* `src/controllers/prueba.controller.js`
* `src/routes/prueba.routes.js`
* `src/middlewares/auth.middleware.js`
* `src/app.js`

Cuando el token es válido, el endpoint devuelve una respuesta de acceso autorizado y el identificador del usuario.

Cuando la solicitud no cumple las condiciones de autenticación, el middleware rechaza el acceso.

---

## 10. Pruebas de seguridad realizadas

Las pruebas se realizaron utilizando Postman.

### Prueba 1. Solicitud sin token

Se envió una solicitud al endpoint protegido sin proporcionar un token.

**Resultado:** `401 Unauthorized`.

La API rechazó la solicitud.

**Estado:** APROBADA.

### Prueba 2. Token alterado

Se modificó un carácter del token para comprobar que la API rechazara un token cuya firma no superara la verificación.

**Resultado:** `401 Unauthorized`.

**Estado:** APROBADA.

### Prueba 3. Token expirado

Se generó un token de prueba con una duración de un segundo. Después de esperar su expiración, se utilizó en Postman.

**Resultado:** `401 Unauthorized`.

**Estado:** APROBADA.

### Prueba 4. Token válido

Se inició sesión, se obtuvo un token JWT y se utilizó como Bearer Token para consultar el endpoint protegido.

**Resultado:** `200 OK`.

La API permitió el acceso y devolvió el identificador del usuario autenticado.

**Estado:** APROBADA.

### Resumen

| Prueba              | Resultado        | Estado   |
| ------------------- | ---------------- | -------- |
| Solicitud sin token | 401 Unauthorized | Aprobada |
| Token alterado      | 401 Unauthorized | Aprobada |
| Token expirado      | 401 Unauthorized | Aprobada |
| Token válido        | 200 OK           | Aprobada |

**Total de pruebas ejecutadas:** 4.

**Pruebas aprobadas:** 4.

Estas pruebas verifican los comportamientos evaluados, pero no equivalen a una auditoría completa de seguridad.

---

## 11. Documentación creada

Se creó el documento:

`backend/docs/pruebas-seguridad-jwt.md`

Contiene:

* Objetivo de las pruebas.
* Endpoint protegido.
* Procedimientos de ejecución.
* Resultados esperados.
* Resultados obtenidos.
* Resumen de los casos de prueba.
* Conclusiones.
* Recomendaciones de seguridad.

El archivo se escribió y se guardó en Visual Studio Code.

---

## 12. Estado general del desarrollo

### Completado

* Configuración inicial del backend con Node.js y Express.
* Conexión con MySQL mediante Prisma.
* Modelo de usuarios.
* Organización del código por capas.
* Repositorio de usuarios.
* Validación de datos mediante Zod.
* Registro de usuarios.
* Protección de contraseñas con bcrypt.
* Inicio de sesión.
* Generación de tokens JWT.
* Middleware de autenticación.
* Endpoint protegido de prueba.
* Pruebas de autenticación con Postman.
* Prueba de token ausente.
* Prueba de token alterado.
* Prueba de token expirado.
* Prueba de token válido.
* Documento de pruebas de seguridad JWT.

### Pendiente de revisar o desarrollar

1. Revisar el código HTTP devuelto por el registro de usuarios y estandarizar las respuestas.
2. Confirmar las pruebas para correos duplicados, datos incompletos y contraseñas incorrectas.
3. Revisar la estructura y el manejo global de errores de la API.
4. Revisar la configuración de las variables de entorno y la protección de datos sensibles.
5. Comprobar si los usuarios deben volver a validarse en la base de datos en cada solicitud protegida.
6. Desarrollar las funcionalidades comerciales de la aplicación.
7. Continuar la integración entre el frontend React y el backend.
8. Implementar progresivamente el catálogo, la personalización de productos, el carrito, los pedidos y las funciones administrativas, según el alcance definitivo.

---

## 13. Punto exacto donde quedamos

Actualmente estamos trabajando en la preparación del proyecto para registrar los últimos cambios y la documentación de seguridad.

Antes de continuar con el desarrollo, debemos mantener actualizado este archivo de progreso para no perder el contexto de la siguiente sesión.

El trabajo funcional más reciente que se completó fue:

**La implementación y verificación del middleware JWT, junto con las cuatro pruebas de seguridad del endpoint protegido.**

El documento de pruebas se encuentra en:

`backend/docs/pruebas-seguridad-jwt.md`

La siguiente actividad de desarrollo, después de terminar la tarea de registro de cambios que tenemos pendiente, será revisar el comportamiento del registro de usuarios y confirmar sus códigos HTTP.

---

## 14. Forma de trabajo

Continuaremos utilizando el siguiente método:

1. Trabajar en un solo paso a la vez.
2. Explicar qué se va a hacer y por qué.
3. Indicar la ruta exacta del archivo.
4. Proporcionar el código completo cuando sea necesario.
5. Ejecutar una prueba para verificar cada cambio.
6. Esperar la confirmación del resultado antes de avanzar.
7. Mantener los comentarios del código en español.
8. No publicar contraseñas, tokens ni claves secretas.

**Último avance funcional:** pruebas de seguridad JWT completadas.

**Siguiente punto funcional:** revisar y estandarizar el registro de usuarios, después de terminar la tarea de registro de cambios pendiente.




















# PLAN DE TRABAJO PARA COMPLETAR CREACIONES & DISEÑO

**Objetivo:** completar una aplicación web de comercio electrónico funcional, segura, responsive y preparada para su despliegue.

**Arquitectura:** frontend React + Vite, backend Node.js + Express, API REST y base de datos MySQL mediante Prisma ORM.

**Estado actual:** módulo inicial de autenticación desarrollado y pruebas básicas de seguridad JWT completadas.

> Los elementos marcados como pendientes constituyen la hoja de ruta. Antes de comenzar cada fase, se verificará qué funcionalidades ya existen para evitar duplicar trabajo.

---

# FASE 1. FINALIZAR Y ESTABILIZAR EL BACKEND

## 1.1. Completar el módulo de autenticación

**Estado:** parcialmente desarrollado.

### Pendiente

* Revisar el registro de usuarios y sus códigos HTTP.
* Comprobar el manejo de correos electrónicos duplicados.
* Validar campos obligatorios, formatos y longitudes.
* Revisar las reglas de seguridad de las contraseñas.
* Confirmar que las contraseñas nunca se devuelvan en las respuestas.
* Verificar los mensajes de error del inicio de sesión.
* Revisar la expiración y validación de los tokens JWT.
* Comprobar el manejo de errores inesperados.
* Evaluar la autorización de rutas según el tipo de usuario.
* Verificar si corresponde consultar la base de datos para confirmar que el usuario autenticado continúa activo.

### Resultado esperado

Un módulo de registro e inicio de sesión que gestione correctamente las solicitudes válidas e inválidas y proteja las credenciales de los usuarios.

## 1.2. Completar la gestión de usuarios

### Pendiente

* Consultar el perfil del usuario autenticado.
* Consultar y actualizar los datos personales.
* Permitir cambiar la contraseña de forma segura.
* Validar que los usuarios solamente puedan modificar sus propios datos.
* Definir el procedimiento de recuperación de contraseña.
* Implementar la autorización de administradores.
* Evitar que un usuario normal acceda a funcionalidades administrativas.

### Resultado esperado

Un módulo que permita gestionar las cuentas de los clientes y controlar los permisos de acceso.

## 1.3. Completar el manejo de errores de la API

### Pendiente

* Estandarizar las respuestas JSON.
* Implementar un manejo centralizado de errores.
* Diferenciar errores de validación, autenticación, autorización y servidor.
* Evitar devolver información sensible en los mensajes de error.
* Verificar los códigos HTTP de cada endpoint.
* Añadir registros de errores útiles para el diagnóstico.

### Resultado esperado

Una API con respuestas consistentes y errores fáciles de identificar y solucionar.

---

# FASE 2. BASE DE DATOS Y CATÁLOGO DE PRODUCTOS

## 2.1. Diseñar y completar el modelo de datos

### Entidades que se deben evaluar e implementar

* Usuarios.
* Roles o permisos, si se necesitan para la autorización.
* Productos.
* Categorías.
* Variantes de productos.
* Imágenes de productos.
* Diseños personalizados.
* Carritos.
* Elementos del carrito.
* Pedidos.
* Elementos de los pedidos.
* Pagos.
* Direcciones de entrega, si forman parte del alcance comercial.

Las entidades deben relacionarse correctamente según las necesidades del negocio.

### Pendiente

* Revisar el modelo entidad-relación.
* Definir las relaciones entre las entidades.
* Establecer claves primarias y foráneas.
* Definir restricciones de unicidad.
* Configurar los tipos de datos apropiados.
* Crear y verificar las migraciones de Prisma.
* Definir reglas para evitar inconsistencias en el inventario y los pedidos.

### Resultado esperado

Una base de datos estructurada para administrar el comercio electrónico.

## 2.2. Desarrollar el catálogo de productos

### Pendiente en el backend

* Registrar productos.
* Consultar el catálogo.
* Consultar el detalle de un producto.
* Actualizar productos.
* Desactivar productos.
* Gestionar categorías.
* Gestionar imágenes.
* Gestionar precios.
* Gestionar tallas y colores.
* Gestionar disponibilidad.
* Incorporar búsquedas y filtros.

### Endpoints previstos

* `GET /api/v1/productos`
* `GET /api/v1/productos/:id`
* `POST /api/v1/productos`
* `PATCH /api/v1/productos/:id`
* `DELETE /api/v1/productos/:id`

Los endpoints de creación, modificación y eliminación deberán estar protegidos y reservados para los administradores.

Los endpoints definitivos se ajustarán a la estructura real del proyecto.

### Resultado esperado

Un catálogo administrable desde el backend y disponible para los clientes en el frontend.

---

# FASE 3. PERSONALIZACIÓN DE PRODUCTOS

Esta funcionalidad es importante para Creaciones & Diseño porque los clientes necesitan solicitar productos personalizados.

## 3.1. Funcionalidades del backend

### Pendiente

* Recibir las características de personalización.
* Registrar la talla seleccionada.
* Registrar el color seleccionado.
* Registrar el diseño solicitado.
* Gestionar las imágenes o archivos enviados por el cliente.
* Validar el tipo y el tamaño de los archivos.
* Almacenar los archivos en un servicio apropiado.
* Asociar cada personalización con su producto y usuario.
* Calcular el precio según las opciones seleccionadas, cuando corresponda.
* Conservar las especificaciones de la personalización en el pedido.

Los archivos no deben aceptarse sin controles de seguridad. También debemos decidir dónde se almacenarán y cómo se accederá a ellos.

### Resultado esperado

Una API que permita recibir y conservar correctamente las especificaciones de los productos personalizados.

---

# FASE 4. CARRITO DE COMPRAS

## 4.1. Funcionalidades del backend

### Pendiente

* Crear o recuperar el carrito del usuario.
* Agregar productos al carrito.
* Modificar cantidades.
* Eliminar productos.
* Conservar las opciones de personalización.
* Calcular los subtotales.
* Calcular el total.
* Verificar la disponibilidad del inventario.
* Validar los precios antes de crear el pedido.

El servidor debe calcular los precios. No debe confiar en los valores enviados por el navegador.

### Resultado esperado

Un carrito que gestione productos, cantidades, precios y personalizaciones correctamente.

---

# FASE 5. PEDIDOS E INVENTARIO

## 5.1. Gestión de pedidos

### Pendiente

* Crear pedidos a partir del carrito.
* Guardar los productos y sus precios correspondientes.
* Conservar las personalizaciones.
* Registrar los datos necesarios para la entrega.
* Asignar un identificador al pedido.
* Consultar los pedidos del usuario autenticado.
* Consultar el detalle de un pedido.
* Gestionar los estados del pedido.
* Permitir a los administradores consultar y actualizar pedidos.
* Evitar que un cliente consulte pedidos de otros usuarios.

### Estados posibles

* Pendiente de pago.
* Pago confirmado.
* En preparación.
* En producción, cuando corresponda.
* Enviado.
* Entregado.
* Cancelado.

Los estados definitivos se definirán de acuerdo con el proceso comercial.

## 5.2. Gestión del inventario

### Pendiente

* Registrar existencias.
* Consultar cantidades disponibles.
* Actualizar el inventario.
* Controlar la disponibilidad de las variantes.
* Evitar ventas de productos agotados.
* Evitar inconsistencias cuando varios clientes intenten comprar simultáneamente.
* Registrar los cambios de inventario cuando corresponda.

### Resultado esperado

Un sistema que gestione los pedidos y las existencias de manera coherente.

---

# FASE 6. PAGOS Y NOTIFICACIONES

## 6.1. Integración de pagos

### Pendiente

* Seleccionar una pasarela de pagos compatible con el negocio y el país.
* Configurar las credenciales mediante variables de entorno.
* Crear las solicitudes de pago desde el backend.
* Registrar los intentos de pago.
* Procesar las notificaciones de la pasarela.
* Verificar la autenticidad de las notificaciones recibidas.
* Actualizar el estado del pedido según el resultado confirmado.
* Gestionar pagos aprobados, rechazados y pendientes.
* Evitar registrar un pago como confirmado solamente porque el navegador lo indique.

No se deben almacenar números completos de tarjetas ni códigos de seguridad en la base de datos.

## 6.2. Notificaciones

### Pendiente

* Definir las notificaciones necesarias.
* Evaluar el envío de confirmaciones de registro.
* Notificar la creación de pedidos.
* Notificar cambios importantes en el estado de los pedidos.
* Configurar el servicio de correo electrónico, si se incluye en el alcance.

### Resultado esperado

Un proceso de compra que permita informar al cliente sobre el estado de su operación.

---

# FASE 7. DESARROLLO DEL FRONTEND CON REACT

## 7.1. Estructura general

### Pendiente por verificar o desarrollar

* Configurar las rutas de navegación.
* Crear componentes reutilizables.
* Organizar las páginas.
* Configurar los servicios para consumir la API.
* Centralizar la configuración del cliente HTTP.
* Implementar el manejo de errores.
* Mostrar estados de carga.
* Mostrar mensajes de éxito y error.
* Configurar las variables de entorno del frontend.

La estructura deberá mantener separados los componentes visuales, las páginas y la comunicación con el backend.

## 7.2. Diseño visual y navegación

### Pendiente

* Diseñar la página de inicio.
* Construir la barra de navegación.
* Diseñar el pie de página.
* Crear los componentes reutilizables.
* Establecer una identidad visual coherente con Creaciones & Diseño.
* Adaptar los diseños a dispositivos móviles, tabletas y computadores.
* Revisar la accesibilidad básica.
* Mejorar los mensajes y las indicaciones para el usuario.

### Resultado esperado

Una interfaz coherente, fácil de utilizar y adaptable a distintos tamaños de pantalla.

## 7.3. Registro e inicio de sesión

### Pendiente

* Crear el formulario de registro.
* Crear el formulario de inicio de sesión.
* Validar los campos en el navegador.
* Conectar los formularios con la API.
* Mostrar errores devueltos por el backend.
* Gestionar correctamente la sesión autenticada.
* Implementar el cierre de sesión.
* Proteger las rutas privadas.
* Gestionar la expiración del token.
* Evaluar una estrategia segura de almacenamiento de la sesión.

La validación del frontend complementa la del backend, pero nunca la reemplaza.

## 7.4. Catálogo de productos

### Pendiente

* Mostrar los productos disponibles.
* Mostrar imágenes, nombres y precios.
* Mostrar categorías.
* Implementar búsqueda.
* Implementar filtros.
* Crear la página de detalle del producto.
* Mostrar las tallas y colores disponibles.
* Mostrar los productos agotados cuando corresponda.

## 7.5. Personalización

### Pendiente

* Crear selectores de tallas.
* Crear selectores de colores.
* Permitir cargar diseños del cliente.
* Mostrar una vista previa cuando sea técnicamente posible.
* Mostrar restricciones de formatos y tamaños.
* Mostrar el precio actualizado según las opciones.
* Conservar las opciones seleccionadas al agregar el producto al carrito.

## 7.6. Carrito de compras

### Pendiente

* Mostrar los productos agregados.
* Mostrar las cantidades.
* Permitir modificar cantidades.
* Permitir eliminar productos.
* Mostrar las personalizaciones.
* Mostrar subtotales y total.
* Gestionar carritos vacíos.
* Actualizar la información cuando cambien los precios o la disponibilidad.

## 7.7. Proceso de compra

### Pendiente

* Crear la pantalla de confirmación del pedido.
* Recopilar los datos de entrega necesarios.
* Mostrar el resumen de compra.
* Permitir seleccionar el método de pago disponible.
* Mostrar el resultado del pago.
* Mostrar el número del pedido.
* Informar sobre el estado del pedido.

## 7.8. Cuenta del cliente

### Pendiente

* Crear el perfil del cliente.
* Permitir actualizar los datos autorizados.
* Mostrar el historial de pedidos.
* Mostrar el detalle de cada pedido.
* Mostrar el estado de las compras.
* Implementar las opciones de cuenta que se definan para el alcance final.

## 7.9. Panel administrativo

### Pendiente

* Crear el panel de administración.
* Mostrar indicadores básicos del negocio.
* Gestionar productos.
* Gestionar categorías.
* Gestionar imágenes.
* Gestionar precios y variantes.
* Gestionar existencias.
* Consultar pedidos.
* Actualizar estados de pedidos.
* Consultar la información necesaria de los clientes.
* Proteger las pantallas y operaciones administrativas.

La seguridad administrativa debe validarse en el backend, no solamente ocultando botones en React.

---

# FASE 8. INTEGRACIÓN ENTRE FRONTEND Y BACKEND

### Pendiente

* Conectar el registro con la API.
* Conectar el inicio de sesión.
* Conectar el catálogo.
* Conectar las páginas de detalle.
* Conectar la personalización.
* Conectar el carrito.
* Conectar la creación de pedidos.
* Conectar el pago.
* Conectar el perfil del usuario.
* Conectar el historial de pedidos.
* Conectar el panel administrativo.
* Verificar el tratamiento de errores HTTP.
* Comprobar que las rutas protegidas funcionen correctamente.
* Verificar la configuración CORS para los entornos de desarrollo y producción.

### Resultado esperado

Un frontend que utilice la API real y la base de datos, sin depender de datos ficticios para las funcionalidades principales.

---

# FASE 9. SEGURIDAD Y CALIDAD

## 9.1. Seguridad

### Pendiente

* Revisar la gestión de variables de entorno.
* Verificar que los secretos no se expongan al frontend.
* Mantener contraseñas protegidas con bcrypt.
* Revisar la autenticación JWT.
* Implementar autorización basada en roles cuando sea necesaria.
* Validar los datos en el servidor.
* Proteger las operaciones administrativas.
* Controlar los archivos que se cargan.
* Revisar los permisos de acceso a los pedidos.
* Incorporar límites de solicitudes en endpoints sensibles.
* Revisar la configuración de CORS.
* Configurar HTTPS en producción.
* Evitar que los errores expongan información interna.

## 9.2. Pruebas

### Pendiente

* Pruebas unitarias de servicios y validaciones.
* Pruebas de integración de la API.
* Pruebas del registro.
* Pruebas del inicio de sesión.
* Pruebas de credenciales incorrectas.
* Pruebas de correos duplicados.
* Pruebas de tokens ausentes, inválidos y expirados.
* Pruebas de permisos.
* Pruebas del catálogo.
* Pruebas del carrito.
* Pruebas de pedidos.
* Pruebas de pagos.
* Pruebas de los formularios del frontend.
* Pruebas de integración entre frontend y backend.
* Pruebas de navegación en dispositivos móviles.

Las cuatro pruebas básicas de seguridad JWT ya se realizaron; deberán conservarse como parte de la documentación técnica.

---

# FASE 10. RENDIMIENTO Y EXPERIENCIA DEL USUARIO

### Pendiente

* Revisar los tiempos de respuesta de la API.
* Evitar consultas innecesarias a la base de datos.
* Optimizar las imágenes de los productos.
* Revisar el rendimiento de React.
* Añadir paginación cuando sea necesaria.
* Mostrar indicadores de carga.
* Evitar envíos duplicados de formularios.
* Mejorar la accesibilidad.
* Revisar la experiencia de compra desde dispositivos móviles.

---

# FASE 11. DOCUMENTACIÓN TÉCNICA

### Pendiente

* Documentar la arquitectura final.
* Documentar los endpoints.
* Documentar los modelos de datos.
* Documentar las variables de entorno necesarias, sin incluir sus secretos.
* Documentar los procedimientos de instalación.
* Documentar la configuración de desarrollo.
* Documentar los casos de prueba.
* Documentar el proceso de despliegue.
* Actualizar `PROGRESO.md` después de cada avance importante.

### Resultado esperado

Un proyecto que otra persona pueda instalar, comprender, probar y mantener siguiendo la documentación.

---

# FASE 12. DESPLIEGUE Y PUBLICACIÓN

### Pendiente

* Elegir un servicio de alojamiento para el backend.
* Elegir un servicio de alojamiento para el frontend.
* Configurar una base de datos MySQL de producción.
* Configurar las variables de entorno de producción.
* Ejecutar las migraciones de forma controlada.
* Configurar las direcciones públicas del frontend y backend.
* Configurar CORS para el dominio definitivo.
* Configurar HTTPS.
* Verificar las conexiones entre los servicios.
* Probar el registro y el inicio de sesión en producción.
* Probar las funciones principales de la aplicación publicada.
* Configurar copias de seguridad apropiadas para la base de datos.
* Establecer un procedimiento de recuperación ante fallos.
* Revisar los registros de errores y el monitoreo básico.

---

# FASE 13. VALIDACIÓN FINAL DEL PROYECTO

La aplicación se considerará lista cuando se cumplan los siguientes criterios:

* Los clientes pueden registrarse e iniciar sesión.
* Las contraseñas están protegidas.
* Las rutas privadas requieren autenticación.
* Los permisos se verifican en el backend.
* Los clientes pueden consultar productos.
* Los clientes pueden personalizar los productos incluidos en el alcance.
* Los clientes pueden administrar su carrito.
* Se pueden crear y consultar pedidos.
* El inventario se gestiona correctamente.
* El proceso de pago funciona con la pasarela elegida, si está incluida en el alcance.
* Los administradores pueden gestionar productos y pedidos.
* El frontend funciona en móviles y computadores.
* Los errores se gestionan correctamente.
* Las pruebas principales pasan.
* La documentación está actualizada.
* La aplicación está publicada y funciona en su entorno de producción.
* No se exponen credenciales ni secretos.

---

# ORDEN RECOMENDADO DE EJECUCIÓN

Para avanzar de manera organizada, seguiremos este orden:

1. Finalizar el registro y el inicio de sesión.
2. Completar las pruebas de autenticación y revisar las respuestas HTTP.
3. Finalizar el manejo de errores y las validaciones del backend.
4. Revisar y completar el modelo de datos.
5. Desarrollar el catálogo de productos.
6. Desarrollar la personalización de productos.
7. Implementar el carrito de compras.
8. Implementar los pedidos y el inventario.
9. Integrar los pagos y las notificaciones.
10. Construir las páginas principales del frontend.
11. Conectar todas las páginas con la API.
12. Desarrollar la cuenta del cliente y el panel administrativo.
13. Ejecutar las pruebas funcionales, de integración y de seguridad.
14. Completar la documentación.
15. Preparar y verificar el despliegue.
16. Ejecutar las pruebas finales en producción.

## ESTADO ACTUAL

**Último avance funcional:** middleware JWT y cuatro pruebas de seguridad completadas.

**Próximo paso funcional:** revisar el registro de usuarios y estandarizar sus respuestas HTTP.

**Objetivo siguiente:** terminar y estabilizar la autenticación antes de avanzar hacia el catálogo de productos.

**Criterio de trabajo:** avanzar paso a paso, verificar cada resultado y actualizar este documento al finalizar cada fase.

