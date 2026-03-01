/*
  Warnings:

  - You are about to drop the `ExternalLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlbumTrack" DROP CONSTRAINT "AlbumTrack_albumId_fkey";

-- DropForeignKey
ALTER TABLE "AlbumTrack" DROP CONSTRAINT "AlbumTrack_songId_fkey";

-- DropIndex
DROP INDEX "Album_id_key";

-- DropIndex
DROP INDEX "Song_id_key";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "externalLinks" JSONB;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "externalLinks" JSONB;

-- DropTable
DROP TABLE "ExternalLink";

-- DropEnum
DROP TYPE "ExternalLinkType";

-- AddForeignKey
ALTER TABLE "AlbumTrack" ADD CONSTRAINT "AlbumTrack_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumTrack" ADD CONSTRAINT "AlbumTrack_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
