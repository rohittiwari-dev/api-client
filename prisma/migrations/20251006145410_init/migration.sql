-- DropForeignKey
ALTER TABLE "public"."collections" DROP CONSTRAINT "collections_parentId_fkey";

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
