import { Environment, Organization } from "@/generated/prisma/browser";
import { RequestWithRelations } from "@/modules/apis/requests/types/store.types";

// types/collection.ts
export interface CollectionWithRelations {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  requests: RequestWithRelations[];
  environments: Environment[];
  children: CollectionWithRelations[];
  parent?: CollectionWithRelations | null;
  workspace: Organization;
}

export interface NestedCollection {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;

  requests: RequestWithRelations[];
  environments: Environment[];
  children: NestedCollection[];
}
