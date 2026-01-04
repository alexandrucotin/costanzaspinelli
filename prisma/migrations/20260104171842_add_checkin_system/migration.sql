-- CreateEnum
CREATE TYPE "CheckInType" AS ENUM ('weekly');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('pending', 'submitted', 'overdue', 'reviewed');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('front', 'side', 'back');

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" "CheckInType" NOT NULL DEFAULT 'weekly',
    "status" "CheckInStatus" NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "data" JSONB,
    "coachNotes" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressEntry" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressPhoto" (
    "id" TEXT NOT NULL,
    "progressEntryId" TEXT NOT NULL,
    "type" "PhotoType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckIn_clientId_idx" ON "CheckIn"("clientId");

-- CreateIndex
CREATE INDEX "CheckIn_status_idx" ON "CheckIn"("status");

-- CreateIndex
CREATE INDEX "CheckIn_scheduledAt_idx" ON "CheckIn"("scheduledAt");

-- CreateIndex
CREATE INDEX "CheckIn_type_idx" ON "CheckIn"("type");

-- CreateIndex
CREATE INDEX "ProgressEntry_clientId_idx" ON "ProgressEntry"("clientId");

-- CreateIndex
CREATE INDEX "ProgressEntry_createdAt_idx" ON "ProgressEntry"("createdAt");

-- CreateIndex
CREATE INDEX "ProgressPhoto_progressEntryId_idx" ON "ProgressPhoto"("progressEntryId");

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressEntry" ADD CONSTRAINT "ProgressEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressPhoto" ADD CONSTRAINT "ProgressPhoto_progressEntryId_fkey" FOREIGN KEY ("progressEntryId") REFERENCES "ProgressEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
