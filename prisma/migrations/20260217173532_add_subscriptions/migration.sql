-- CreateTable
CREATE TABLE `Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tier` ENUM('FREE', 'PRO', 'FEATURED', 'CUSTOM') NOT NULL,
    `interval` ENUM('MONTH', 'YEAR') NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'CAD',
    `priceCents` INTEGER NOT NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Plan_tier_interval_idx`(`tier`, `interval`),
    UNIQUE INDEX `Plan_tier_interval_currency_key`(`tier`, `interval`, `currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `tier` ENUM('FREE', 'PRO', 'FEATURED', 'CUSTOM') NOT NULL,
    `interval` ENUM('MONTH', 'YEAR') NOT NULL,
    `status` ENUM('INCOMPLETE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID') NOT NULL DEFAULT 'INCOMPLETE',
    `currency` VARCHAR(191) NOT NULL DEFAULT 'CAD',
    `priceCents` INTEGER NOT NULL,
    `planId` INTEGER NULL,
    `customLabel` VARCHAR(191) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `currentPeriodStart` DATETIME(3) NULL,
    `currentPeriodEnd` DATETIME(3) NULL,
    `cancelAtPeriodEnd` BOOLEAN NOT NULL DEFAULT false,
    `canceledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Subscription_companyId_idx`(`companyId`),
    INDEX `Subscription_tier_status_idx`(`tier`, `status`),
    UNIQUE INDEX `Subscription_companyId_isCurrent_key`(`companyId`, `isCurrent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
