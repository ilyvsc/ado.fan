-- CreateEnum
CREATE TYPE "ExternalLinkType" AS ENUM ('youtubeVideo', 'nicoVideo', 'link', 'embed');

-- CreateTable
CREATE TABLE "ExternalLink" (
    "relationId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "type" "ExternalLinkType" NOT NULL,
    "value" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("relationType","relationId","type","value")
);

-- CreateIndex
CREATE INDEX "external_link_relation_idx" ON "ExternalLink"("relationType", "relationId");

-- CreateIndex
CREATE INDEX "external_link_type_idx" ON "ExternalLink"("type");
