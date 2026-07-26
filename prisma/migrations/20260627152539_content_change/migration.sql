-- CreateEnum
CREATE TYPE "ContentEntity" AS ENUM ('song', 'album');

-- CreateTable
CREATE TABLE "ContentChange" (
    "id" TEXT NOT NULL,
    "entity" "ContentEntity" NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3),
    "commitSha" TEXT,

    CONSTRAINT "ContentChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentChange_syncedAt_idx" ON "ContentChange"("syncedAt");

-- CreateIndex
CREATE INDEX "ContentChange_entity_entityId_idx" ON "ContentChange"("entity", "entityId");
