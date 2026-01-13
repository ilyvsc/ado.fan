/*
  Warnings:

  - The primary key for the `ExternalLink` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ExternalLink" DROP CONSTRAINT "ExternalLink_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id");
