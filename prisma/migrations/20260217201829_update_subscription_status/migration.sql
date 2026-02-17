/*
  Warnings:

  - You are about to alter the column `status` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `Subscription` MODIFY `status` ENUM('INACTIVE', 'ACTIVE', 'CANCELLED') NOT NULL DEFAULT 'INACTIVE';
