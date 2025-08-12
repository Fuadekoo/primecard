/*
  Warnings:

  - A unique constraint covering the columns `[guestId]` on the table `businessCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `businessCard_guestId_key` ON `businessCard`(`guestId`);
