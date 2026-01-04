-- CreateEnum
CREATE TYPE "HabitType" AS ENUM ('checkbox', 'number', 'scale');

-- CreateEnum
CREATE TYPE "HabitCategory" AS ENUM ('hydration', 'sleep', 'nutrition', 'recovery', 'movement', 'mindset', 'other');

-- CreateEnum
CREATE TYPE "HabitFrequency" AS ENUM ('daily', 'weekly');

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "HabitType" NOT NULL,
    "category" "HabitCategory" NOT NULL,
    "frequency" "HabitFrequency" NOT NULL DEFAULT 'daily',
    "target" JSONB,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "HabitType" NOT NULL,
    "category" "HabitCategory" NOT NULL,
    "frequency" "HabitFrequency" NOT NULL DEFAULT 'daily',
    "target" JSONB,
    "icon" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Habit_clientId_idx" ON "Habit"("clientId");

-- CreateIndex
CREATE INDEX "Habit_isActive_idx" ON "Habit"("isActive");

-- CreateIndex
CREATE INDEX "HabitLog_habitId_idx" ON "HabitLog"("habitId");

-- CreateIndex
CREATE INDEX "HabitLog_date_idx" ON "HabitLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
