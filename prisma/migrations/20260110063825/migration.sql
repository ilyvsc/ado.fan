/*
  Warnings:

  - You are about to drop the column `year` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nicoId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[youtubeId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "song_year_idx";

-- AlterTable
ALTER TABLE "Lyrics" ALTER COLUMN "lyricsJapanese" DROP NOT NULL,
ALTER COLUMN "lyricsRomaji" DROP NOT NULL,
ALTER COLUMN "lyricsEnglish" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "year";

-- CreateIndex
CREATE UNIQUE INDEX "Song_nicoId_key" ON "Song"("nicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_youtubeId_key" ON "Song"("youtubeId");
