/*
  Warnings:

  - The `headers` column on the `requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parameters` column on the `requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "headers",
ADD COLUMN     "headers" JSONB[] DEFAULT ARRAY[]::JSONB[],
DROP COLUMN "parameters",
ADD COLUMN     "parameters" JSONB[] DEFAULT ARRAY[]::JSONB[];
