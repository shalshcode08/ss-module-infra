-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('STREAMING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "contentJson" TEXT;

-- AlterTable
ALTER TABLE "solutions" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "fallBackUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "streamStatus" "StreamStatus" NOT NULL DEFAULT 'STREAMING';
