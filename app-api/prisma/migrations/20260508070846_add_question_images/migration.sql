-- CreateTable
CREATE TABLE "question_images" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_images_questionId_idx" ON "question_images"("questionId");

-- AddForeignKey
ALTER TABLE "question_images" ADD CONSTRAINT "question_images_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
