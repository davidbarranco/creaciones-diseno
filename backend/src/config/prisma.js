
// Importa PrismaClient, la clase que permite interactuar con la base de datos.
const { PrismaClient } = require("@prisma/client");

// Crea una instancia de Prisma Client para consultar y modificar los datos.
const prisma = new PrismaClient();

// Exporta la instancia para reutilizarla en los repositorios del backend.
module.exports = prisma;