/*
  Warnings:

  - The primary key for the `user_configs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_configs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_configs" DROP CONSTRAINT "user_configs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_configs_pkey" PRIMARY KEY ("id");
