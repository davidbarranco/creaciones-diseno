# Pruebas de Seguridad JWT

## 1. Información general

**Proyecto:** Creaciones & Diseño  
**Módulo:** Autenticación y autorización  
**Tecnología:** Node.js, Express y JSON Web Token (JWT)  
**Herramienta de pruebas:** Postman  
**Fecha:** 28 de octubre de 2026

## 2. Objetivo

Verificar que el middleware de autenticación de la API REST
permita el acceso a las rutas protegidas únicamente cuando se
proporcione un token JWT válido.

También se comprobará que la API rechace las solicitudes
sin token, con tokens alterados o con tokens expirados.

## 3. Endpoint protegido

**Método HTTP:** GET

**URL:**

http://localhost:3000/api/v1/prueba/protegido

**Mecanismo de autenticación:** Bearer Token (JWT).

## 4. Casos de prueba

### Prueba 1. Solicitud sin token

**Objetivo:** Comprobar que la API rechace las solicitudes que
no incluyen un token de autenticación.

**Procedimiento:**

1. Abrir Postman.
2. Seleccionar el método GET.
3. Introducir la URL del endpoint protegido.
4. Enviar la solicitud sin configurar la autenticación.

**Resultado esperado:**

Código HTTP: 401 Unauthorized.

Mensaje:

"Se requiere un token de autenticación."

**Resultado obtenido:** 401 Unauthorized.

**Estado:** APROBADA.

---

### Prueba 2. Token alterado

**Objetivo:** Verificar que la API rechace un token cuya firma
no sea válida.

**Procedimiento:**

1. Obtener un token mediante el inicio de sesión.
2. Configurar la autenticación Bearer Token en Postman.
3. Alterar un carácter del token para esta prueba.
4. Enviar la solicitud al endpoint protegido.

**Resultado esperado:**

Código HTTP: 401 Unauthorized.

La API debe rechazar el token que no supere la verificación.

**Resultado obtenido:** 401 Unauthorized.

**Estado:** APROBADA.

---

### Prueba 3. Token expirado

**Objetivo:** Comprobar que la API rechace los tokens cuyo
periodo de validez haya finalizado.

**Procedimiento:**

1. Generar un token de prueba con una duración de un segundo.
2. Esperar hasta que el token expire.
3. Configurar el token expirado en Postman como Bearer Token.
4. Enviar la solicitud al endpoint protegido.

**Resultado esperado:**

Código HTTP: 401 Unauthorized.

Mensaje:

"El token es inválido o ha expirado."

**Resultado obtenido:** 401 Unauthorized.

**Estado:** APROBADA.

---

### Prueba 4. Token válido

**Objetivo:** Comprobar que la API permita el acceso cuando
el token JWT tiene una firma válida y no ha expirado.

**Procedimiento:**

1. Iniciar sesión con un usuario registrado.
2. Obtener el token JWT de la respuesta.
3. En Postman, seleccionar Authorization.
4. Elegir el tipo Bearer Token.
5. Introducir el token obtenido.
6. Enviar la solicitud al endpoint protegido.

**Resultado esperado:**

Código HTTP: 200 OK.

La API debe confirmar el acceso autorizado y devolver el
identificador del usuario asociado al token.

**Resultado obtenido:** 200 OK.

**Estado:** APROBADA.

## 5. Resumen de resultados

| N.º | Caso de prueba | Resultado obtenido | Estado |
|---|---|---|---|
| 1 | Solicitud sin token | 401 Unauthorized | APROBADA |
| 2 | Token alterado | 401 Unauthorized | APROBADA |
| 3 | Token expirado | 401 Unauthorized | APROBADA |
| 4 | Token válido | 200 OK | APROBADA |

**Total de pruebas:** 4.

**Pruebas aprobadas:** 4.

**Pruebas fallidas:** 0.

## 6. Conclusiones

Las pruebas realizadas permitieron comprobar el funcionamiento
del middleware de autenticación JWT de la API de Creaciones
& Diseño.

Se verificó que las solicitudes sin token, con tokens alterados
y con tokens expirados fueran rechazadas con el código HTTP 401.

También se comprobó que una solicitud con un token válido
pudiera acceder al endpoint protegido y recibir una respuesta
HTTP 200.

Estos resultados confirman el funcionamiento de las
validaciones probadas. No representan, por sí solos, una
auditoría completa de seguridad de la aplicación.

## 7. Observaciones de seguridad

- La clave JWT debe almacenarse en la variable de entorno
  JWT_SECRET y no publicarse en el repositorio.
- Las contraseñas de los usuarios deben almacenarse utilizando
  un algoritmo de hash seguro, como bcrypt.
- Los tokens deben enviarse mediante el encabezado Authorization
  utilizando el esquema Bearer.
- No se deben compartir públicamente los tokens de acceso.
- En producción se debe utilizar HTTPS.
- Las rutas protegidas que necesiten información actualizada
  del usuario deben comprobar también su estado en la base de
  datos cuando corresponda.