/*
  Warnings:

  - You are about to drop the column `lyricsEnglish` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `lyricsJapanese` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `lyricsRomaji` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "lyricsEnglish",
DROP COLUMN "lyricsJapanese",
DROP COLUMN "lyricsRomaji";

-- CreateTable
CREATE TABLE "Lyrics" (
    "songId" TEXT NOT NULL,
    "lyricsJapanese" TEXT NOT NULL,
    "lyricsRomaji" TEXT NOT NULL,
    "lyricsEnglish" TEXT NOT NULL,

    CONSTRAINT "Lyrics_pkey" PRIMARY KEY ("songId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lyrics_songId_key" ON "Lyrics"("songId");

-- CreateIndex
CREATE INDEX "lyrics_song_id_idx" ON "Lyrics"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_id_key" ON "Album"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Song_id_key" ON "Song"("id");

-- AddForeignKey
ALTER TABLE "Lyrics" ADD CONSTRAINT "Lyrics_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
