/*
  Warnings:

  - You are about to drop the column `content` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `category` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentHtml` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BlogPost` DROP COLUMN `content`,
    DROP COLUMN `coverImage`,
    DROP COLUMN `published`,
    ADD COLUMN `category` ENUM('PLANNING_GUIDE', 'HOMEOWNER_TIPS', 'EXPERT_SPOTLIGHT') NOT NULL,
    ADD COLUMN `contentHtml` LONGTEXT NOT NULL,
    ADD COLUMN `coverImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE `BlogPostCity` (
    `blogPostId` INTEGER NOT NULL,
    `cityId` INTEGER NOT NULL,

    INDEX `BlogPostCity_cityId_idx`(`cityId`),
    PRIMARY KEY (`blogPostId`, `cityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `BlogPost_status_idx` ON `BlogPost`(`status`);

-- CreateIndex
CREATE INDEX `BlogPost_category_idx` ON `BlogPost`(`category`);

-- CreateIndex
CREATE INDEX `BlogPost_publishedAt_idx` ON `BlogPost`(`publishedAt`);

-- AddForeignKey
ALTER TABLE `BlogPostCity` ADD CONSTRAINT `BlogPostCity_blogPostId_fkey` FOREIGN KEY (`blogPostId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogPostCity` ADD CONSTRAINT `BlogPostCity_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
