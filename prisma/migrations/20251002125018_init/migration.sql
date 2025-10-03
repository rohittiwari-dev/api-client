/*
  Warnings:

  - The values [GRPC,GRAPHQL] on the enum `RequestType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `collections` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestType_new" AS ENUM ('HTTP', 'WEBSOCKET', 'SOCKET_IO');
ALTER TABLE "public"."requests" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "requests" ALTER COLUMN "type" TYPE "RequestType_new" USING ("type"::text::"RequestType_new");
ALTER TYPE "RequestType" RENAME TO "RequestType_old";
ALTER TYPE "RequestType_new" RENAME TO "RequestType";
DROP TYPE "public"."RequestType_old";
ALTER TABLE "requests" ALTER COLUMN "type" SET DEFAULT 'HTTP';
COMMIT;

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "type";

-- DropEnum
DROP TYPE "public"."CollectionType";
