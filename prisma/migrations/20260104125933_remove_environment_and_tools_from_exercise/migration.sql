/*
  Warnings:

  - You are about to drop the column `environment` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `toolNames` on the `ExerciseRow` table. All the data in the column will be lost.
  - You are about to drop the `_ExerciseToTool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExerciseToTool" DROP CONSTRAINT "_ExerciseToTool_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExerciseToTool" DROP CONSTRAINT "_ExerciseToTool_B_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "environment";

-- AlterTable
ALTER TABLE "ExerciseRow" DROP COLUMN "toolNames",
ADD COLUMN     "toolId" TEXT;

-- DropTable
DROP TABLE "_ExerciseToTool";

-- CreateIndex
CREATE INDEX "ExerciseRow_toolId_idx" ON "ExerciseRow"("toolId");

-- AddForeignKey
ALTER TABLE "ExerciseRow" ADD CONSTRAINT "ExerciseRow_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE SET NULL ON UPDATE CASCADE;
