/*
  Warnings:

  - The primary key for the `Section` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Section` table. All the data in the column will be lost.
  - Added the required column `name` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Section_id_idx";

-- DropIndex
DROP INDEX "public"."Section_id_songId_key";

-- AlterTable
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_pkey",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "songId" DROP DEFAULT,
ADD CONSTRAINT "Section_pkey" PRIMARY KEY ("name", "songId");

-- CreateIndex
CREATE INDEX "Section_songId_idx" ON "public"."Section"("songId");
