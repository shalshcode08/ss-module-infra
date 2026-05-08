/*
  Warnings:

  - You are about to drop the column `position` on the `question_images` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `question_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId]` on the table `question_images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "question_images_questionId_idx";

-- AlterTable
ALTER TABLE "question_images" DROP COLUMN "position",
DROP COLUMN "url",
ADD COLUMN     "favicons" TEXT[],
ADD COLUMN     "urls" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "question_images_questionId_key" ON "question_images"("questionId");
