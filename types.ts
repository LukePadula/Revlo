// Assume this is in a .ts or .d.ts file
// You must import the 'admin' module to use its types.
import * as admin from "firebase-admin";

// --- Core Utility Types ---
export type ColourVariant = "blue" | "purple" | "green" | "orange";
export type ErrorMap = Record<string, string>;
export type CategoryRequiredType = "all" | "select" | "optional";
export type IconConfigKey = keyof typeof iconConfigMap;

export interface InputDocument {
  type: string;
  icon: string;
  required: boolean;
  label: string;
  description: string;
  colourVariant: ColourVariant;
}

export interface DocListType {
  label: string;
  id: string;
  selected: boolean;
  description?: string;
}

export interface Category {
  title: string;
  description: string;
  requiredType: CategoryRequiredType;
  selected: boolean;
  minimumRequiredDocumentCount: number;
  requestedDocumentList: DocListType[];
}

export interface DocumentCategoryMap {
  identity: Category;
  address: Category;
  finance: Category;
  education: Category;
}

export interface IconConfig {
  name: string;
  colour: string;
}

export interface iconConfigMap {
  identity: IconConfig;
  address: IconConfig;
  finance: IconConfig;
  education: IconConfig;
}

export interface Recipient {
  name: string;
  email: string;
}

export interface RequestDetails {
  id?: string;
  title: string;
  recipientName: string; // Kept for backward compatibility
  email: string; // Kept for backward compatibility
  recipients?: Recipient[]; // New: array of recipients
  createdAt?: Date;
  createdBy?: string;
  status: string;
  purpose: string;
  expires: string;
}

export interface DataPolicy {
  encrypt: boolean;
  autoDeletePeriod: string;
  auditTrail: boolean;
}

export interface Audit {
  created: admin.firestore.FieldValue | admin.firestore.Timestamp | null;
  viewed: admin.firestore.FieldValue | admin.firestore.Timestamp | null;
  submitted: admin.firestore.FieldValue | admin.firestore.Timestamp | null;
}

export interface DocumentRequest {
  id: string | null;
  organizationId: string;
  createdBy: string;
  requestedCategories: DocumentCategoryMap;
  requestDetails: RequestDetails;
  dataPolicy: DataPolicy;
  audit: Audit;
  uploadedFiles?: Record<string, any[]>; // Optional: uploaded file metadata
}
