/*
  Warnings:

  - You are about to drop the `SectionItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,songId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."SectionItem" DROP CONSTRAINT "SectionItem_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SectionItem" DROP CONSTRAINT "SectionItem_songId_fkey";

-- DropIndex
DROP INDEX "public"."Section_id_key";

-- AlterTable
ALTER TABLE "public"."Section" ADD COLUMN     "songId" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "public"."SectionItem";

-- CreateIndex
CREATE INDEX "album_release_date_idx" ON "public"."Album"("releaseDate" DESC);

-- CreateIndex
CREATE INDEX "album_type_idx" ON "public"."Album"("type");

-- CreateIndex
CREATE INDEX "album_track_order_idx" ON "public"."AlbumTrack"("albumId", "trackNumber");

-- CreateIndex
CREATE INDEX "Section_id_idx" ON "public"."Section"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Section_id_songId_key" ON "public"."Section"("id", "songId");

-- CreateIndex
CREATE INDEX "song_release_date_idx" ON "public"."Song"("releaseDate" DESC);

-- CreateIndex
CREATE INDEX "song_year_idx" ON "public"."Song"("year");

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
