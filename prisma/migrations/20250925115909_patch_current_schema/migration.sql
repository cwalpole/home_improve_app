/*
  Warnings:

  - You are about to drop the column `content` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_serviceId_fkey`;

-- AlterTable
ALTER TABLE `Company` ADD COLUMN `url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `content`,
    DROP COLUMN `excerpt`,
    DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Project`;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `regionCode` VARCHAR(191) NULL,
    `regionSlug` VARCHAR(10) NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'Canada',

    UNIQUE INDEX `City_slug_key`(`slug`),
    INDEX `City_regionCode_country_idx`(`regionCode`, `country`),
    INDEX `City_name_idx`(`name`),
    UNIQUE INDEX `city_name_region_country`(`name`, `regionCode`, `country`),
    UNIQUE INDEX `City_regionSlug_slug_key`(`regionSlug`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceCity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,

    INDEX `ServiceCity_cityId_idx`(`cityId`),
    INDEX `ServiceCity_serviceId_idx`(`serviceId`),
    UNIQUE INDEX `ServiceCity_serviceId_cityId_key`(`serviceId`, `cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyServiceCity` (
    `companyId` INTEGER NOT NULL,
    `serviceCityId` INTEGER NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `priceTier` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CompanyServiceCity_serviceCityId_idx`(`serviceCityId`),
    PRIMARY KEY (`companyId`, `serviceCityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Service_name_key` ON `Service`(`name`);

-- AddForeignKey
ALTER TABLE `ServiceCity` ADD CONSTRAINT `ServiceCity_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceCity` ADD CONSTRAINT `ServiceCity_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyServiceCity` ADD CONSTRAINT `CompanyServiceCity_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyServiceCity` ADD CONSTRAINT `CompanyServiceCity_serviceCityId_fkey` FOREIGN KEY (`serviceCityId`) REFERENCES `ServiceCity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
