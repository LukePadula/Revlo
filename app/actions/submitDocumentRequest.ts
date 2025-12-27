"use server";

import { randomUUID } from "crypto";
import { adminDB, adminBucket } from "@/app/lib/firebase/admin";
import { encryptBuffer } from "@/app/lib/crypto";
import { DocumentRequest, RequestDetails, DocumentCategoryMap } from "@/types";
import * as admin from "firebase-admin/firestore";

interface FileData {
  name: string;
  size: number;
  type: string;
  data: string; // base64 encoded
}

export interface UploadedFileMetadata {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  type: string;
  documentId: string;
  encryptedDataKey: string;
  iv: string;
  authTag: string;
  kmsKeyVersion: string;
}

interface SubmitRequestParams {
  requestDetails: RequestDetails;
  categories: DocumentCategoryMap;
  files: Record<string, FileData[]>;
  requestId?: string; // Optional: if provided, updates existing request instead of creating new one
}

async function uploadFileToStorage(
  file: FileData,
  requestId: string,
  documentId: string
): Promise<UploadedFileMetadata> {
  // Validation
  if (file.size > 10 * 1024 * 1024) throw new Error("File too large");
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) throw new Error("Invalid file type");

  // Encrypt file
  const buffer = Buffer.from(file.data, "base64");
  const encryptedFile = await encryptBuffer(buffer);

  // Unique filename
  const fileExtension = file.name.split(".").pop() || "bin";
  const fileName = `requests/${requestId}/documents/${documentId}/${randomUUID()}.${fileExtension}`;

  // Verify bucket exists before uploading
  const [bucketExists] = await adminBucket.exists();
  if (!bucketExists) {
    const projectId = adminBucket.name.split(".")[0];
    throw new Error(
      `Storage bucket "${adminBucket.name}" does not exist.\n\n` +
        `To fix this:\n` +
        `1. Go to Firebase Console: https://console.firebase.google.com/project/${projectId}/storage\n` +
        `2. Click "Get Started" to enable Firebase Storage\n` +
        `3. The default bucket "${adminBucket.name}" will be created automatically\n` +
        `4. Or verify the bucket name in your Firebase project settings`
    );
  }

  // Upload encrypted file
  const fileRef = adminBucket.file(fileName);
  await fileRef.save(encryptedFile.encrypted, {
    metadata: {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        documentId,
        requestId,
        uploadedAt: new Date().toISOString(),
        encryptedDataKey:
          encryptedFile.encryptedDataKey?.toString("base64") || "",
        iv: encryptedFile.iv.toString("base64"),
        authTag: encryptedFile.authTag.toString("base64"),
        kmsKeyVersion: encryptedFile.kmsKeyVersion,
      },
    },
  });

  // Generate signed URL
  const [signedUrl] = await fileRef.getSignedUrl({
    action: "read",
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return {
    url: signedUrl,
    fileName,
    originalName: file.name,
    size: file.size,
    type: file.type,
    documentId,
    encryptedDataKey: encryptedFile.encryptedDataKey?.toString("base64") || "",
    iv: encryptedFile.iv.toString("base64"),
    authTag: encryptedFile.authTag.toString("base64"),
    kmsKeyVersion: encryptedFile.kmsKeyVersion,
  };
}

async function uploadFilesForDocument(
  documentId: string,
  files: FileData[],
  requestId: string
): Promise<UploadedFileMetadata[]> {
  return Promise.all(
    files.map((file) => uploadFileToStorage(file, requestId, documentId))
  );
}

export async function submitDocumentRequest({
  requestDetails,
  categories,
  files,
  requestId,
}: SubmitRequestParams) {
  const finalRequestId = requestId || randomUUID();
  console.log("requestId", finalRequestId);
  console.log("requestDetails", requestDetails);
  console.log("categories", categories);
  console.log("files", files);

  const uploadedFiles: Record<string, UploadedFileMetadata[]> = {};

  // Upload all files
  if (files && Object.keys(files).length > 0) {
    const promises = Object.entries(files).map(
      async ([documentId, fileArray]) => {
        if (fileArray.length === 0)
          return [documentId, []] as [string, UploadedFileMetadata[]];
        const uploaded = await uploadFilesForDocument(
          documentId,
          fileArray,
          finalRequestId
        );
        return [documentId, uploaded] as [string, UploadedFileMetadata[]];
      }
    );
    const results = await Promise.all(promises);
    results.forEach(([documentId, metadata]) => {
      if (metadata.length > 0) uploadedFiles[documentId] = metadata;
    });
  }

  // Prepare request document
  const requestData: DocumentRequest = {
    id: finalRequestId,
    requestDetails: { ...requestDetails, id: finalRequestId },
    requestedCategories: categories,
    dataPolicy: {
      encrypt: true,
      autoDeletePeriod: "30",
      auditTrail: true,
    },
    audit: {
      created: admin.FieldValue.serverTimestamp(),
      viewed: null,
      submitted: admin.FieldValue.serverTimestamp(), // Mark as submitted
    },
    uploadedFiles,
  };

  // Save to Firestore (update if requestId provided, otherwise create new)
  await adminDB
    .collection("requests")
    .doc(finalRequestId)
    .set(requestData, { merge: requestId ? true : false });

  return {
    success: true,
    requestId: finalRequestId,
    fileCount: Object.values(uploadedFiles).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    uploadedFiles,
  };
}
