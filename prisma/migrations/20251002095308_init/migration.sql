-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('API', 'WEBSOCKET', 'SOCKET_IO', 'GRPC', 'GRAPHQL', 'MIXED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('HTTP', 'WEBSOCKET', 'SOCKET_IO', 'GRPC', 'GRAPHQL');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('NONE', 'RAW', 'FORM_DATA', 'X_WWW_FORM_URLENCODED', 'BINARY', 'GRAPHQL');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('CONNECTION', 'MESSAGE', 'EVENT', 'DISCONNECTION');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('SEND', 'RECEIVE');

-- CreateEnum
CREATE TYPE "MessageFormat" AS ENUM ('JSON', 'TEXT', 'BINARY', 'XML');

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CollectionType" NOT NULL DEFAULT 'API',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "method" "HttpMethod",
    "url" TEXT,
    "type" "RequestType" NOT NULL DEFAULT 'HTTP',
    "headers" JSONB,
    "parameters" JSONB,
    "body" JSONB,
    "bodyType" "BodyType",
    "auth" JSONB,
    "messageType" "MessageType",
    "openApiSpec" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MessageDirection" NOT NULL DEFAULT 'SEND',
    "data" TEXT NOT NULL,
    "format" "MessageFormat" NOT NULL DEFAULT 'JSON',
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_history" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "statusCode" INTEGER,
    "headers" JSONB,
    "body" JSONB,
    "duration" INTEGER,
    "size" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "request_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variables" JSONB,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "workspaceId" TEXT,
    "collectionId" TEXT,
    "requestId" TEXT,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collections_workspaceId_idx" ON "collections"("workspaceId");

-- CreateIndex
CREATE INDEX "collections_parentId_idx" ON "collections"("parentId");

-- CreateIndex
CREATE INDEX "requests_collectionId_idx" ON "requests"("collectionId");

-- CreateIndex
CREATE INDEX "Environment_workspaceId_idx" ON "Environment"("workspaceId");

-- CreateIndex
CREATE INDEX "Environment_userId_idx" ON "Environment"("userId");

-- CreateIndex
CREATE INDEX "organization_slug_idx" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_messages" ADD CONSTRAINT "request_messages_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_history" ADD CONSTRAINT "request_history_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Environment" ADD CONSTRAINT "Environment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
