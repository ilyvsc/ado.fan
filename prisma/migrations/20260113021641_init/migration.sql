-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('single', 'ep', 'album');

-- CreateEnum
CREATE TYPE "ExternalLinkType" AS ENUM ('youtubeVideo', 'nicoVideo', 'link', 'embed');

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "titleEnglish" TEXT NOT NULL,
    "titleJapanese" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "nicoId" TEXT,
    "youtubeId" TEXT,
    "coverArt" TEXT NOT NULL,
    "themeColor" TEXT,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lyrics" (
    "songId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "translator" TEXT,
    "lines" TEXT[],

    CONSTRAINT "Lyrics_pkey" PRIMARY KEY ("songId","language")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "titleEnglish" TEXT NOT NULL,
    "titleJapanese" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "type" "AlbumType" NOT NULL,
    "coverArt" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumTrack" (
    "albumId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "isBonusTrack" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AlbumTrack_pkey" PRIMARY KEY ("albumId","songId")
);

-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" SERIAL NOT NULL,
    "relationId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "type" "ExternalLinkType" NOT NULL,
    "value" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_id_key" ON "Song"("id");

-- CreateIndex
CREATE INDEX "song_release_date_idx" ON "Song"("releaseDate" DESC);

-- CreateIndex
CREATE INDEX "song_title_english_idx" ON "Song"("titleEnglish");

-- CreateIndex
CREATE INDEX "song_title_japanese_idx" ON "Song"("titleJapanese");

-- CreateIndex
CREATE INDEX "Lyrics_songId_idx" ON "Lyrics"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_id_key" ON "Album"("id");

-- CreateIndex
CREATE INDEX "album_release_date_idx" ON "Album"("releaseDate" DESC);

-- CreateIndex
CREATE INDEX "album_type_idx" ON "Album"("type");

-- CreateIndex
CREATE INDEX "album_track_order_idx" ON "AlbumTrack"("albumId", "trackNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumTrack_albumId_trackNumber_key" ON "AlbumTrack"("albumId", "trackNumber");

-- CreateIndex
CREATE INDEX "external_link_relation_idx" ON "ExternalLink"("relationType", "relationId");

-- CreateIndex
CREATE INDEX "external_link_type_idx" ON "ExternalLink"("type");

-- AddForeignKey
ALTER TABLE "Lyrics" ADD CONSTRAINT "Lyrics_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumTrack" ADD CONSTRAINT "AlbumTrack_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumTrack" ADD CONSTRAINT "AlbumTrack_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
