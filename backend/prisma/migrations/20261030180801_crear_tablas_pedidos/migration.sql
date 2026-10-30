-- CreateTable
CREATE TABLE `pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `direccion` VARCHAR(255) NOT NULL,
    `ciudad` VARCHAR(100) NOT NULL,
    `departamento` VARCHAR(100) NOT NULL,
    `indicaciones` TEXT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `estado` VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalles_pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `nombreProducto` VARCHAR(150) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalles_pedido` ADD CONSTRAINT `detalles_pedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
