-- AlterTable
ALTER TABLE `Company` ADD COLUMN `galleryImages` JSON NULL,
    ADD COLUMN `heroImagePublicId` VARCHAR(191) NULL,
    ADD COLUMN `heroImageUrl` LONGTEXT NULL;
