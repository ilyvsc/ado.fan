/*
  Warnings:

  - The primary key for the `Lyrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lyricsEnglish` on the `Lyrics` table. All the data in the column will be lost.
  - You are about to drop the column `lyricsJapanese` on the `Lyrics` table. All the data in the column will be lost.
  - You are about to drop the column `lyricsRomaji` on the `Lyrics` table. All the data in the column will be lost.
  - Added the required column `language` to the `Lyrics` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lyrics_songId_key";

-- AlterTable
ALTER TABLE "Lyrics" DROP CONSTRAINT "Lyrics_pkey",
DROP COLUMN "lyricsEnglish",
DROP COLUMN "lyricsJapanese",
DROP COLUMN "lyricsRomaji",
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "lines" TEXT[],
ADD COLUMN     "translator" TEXT,
ADD CONSTRAINT "Lyrics_pkey" PRIMARY KEY ("songId", "language");

-- RenameIndex
ALTER INDEX "lyrics_song_id_idx" RENAME TO "Lyrics_songId_idx";
