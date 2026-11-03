-- AlterTable
ALTER TABLE `detalles_pedido` ADD COLUMN `talla` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `productos` ADD COLUMN `requiereTalla` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `variantes_productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productoId` INTEGER NOT NULL,
    `talla` VARCHAR(10) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `variantes_productos_productoId_talla_key`(`productoId`, `talla`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `variantes_productos` ADD CONSTRAINT `variantes_productos_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
