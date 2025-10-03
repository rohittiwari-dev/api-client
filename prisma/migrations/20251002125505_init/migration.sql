/*
  Warnings:

  - The values [GRAPHQL] on the enum `BodyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [HTTP] on the enum `RequestType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `openApiSpec` on the `requests` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BodyType_new" AS ENUM ('NONE', 'RAW', 'FORM_DATA', 'X_WWW_FORM_URLENCODED', 'BINARY');
ALTER TABLE "requests" ALTER COLUMN "bodyType" TYPE "BodyType_new" USING ("bodyType"::text::"BodyType_new");
ALTER TYPE "BodyType" RENAME TO "BodyType_old";
ALTER TYPE "BodyType_new" RENAME TO "BodyType";
DROP TYPE "public"."BodyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestType_new" AS ENUM ('API', 'WEBSOCKET', 'SOCKET_IO');
ALTER TABLE "public"."requests" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "requests" ALTER COLUMN "type" TYPE "RequestType_new" USING ("type"::text::"RequestType_new");
ALTER TYPE "RequestType" RENAME TO "RequestType_old";
ALTER TYPE "RequestType_new" RENAME TO "RequestType";
DROP TYPE "public"."RequestType_old";
ALTER TABLE "requests" ALTER COLUMN "type" SET DEFAULT 'API';
COMMIT;

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "openApiSpec",
ALTER COLUMN "type" SET DEFAULT 'API';
