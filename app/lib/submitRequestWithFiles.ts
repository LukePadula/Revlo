"use client";

import { RequestDetails, DocumentCategoryMap } from "@/types";
import { submitDocumentRequest } from "@/app/actions/submitDocumentRequest";

/**
 * Client-side helper to upload files and submit request
 * This handles the file upload process and then calls the server action
 */
export async function submitRequestWithFiles(
  requestDetails: RequestDetails,
  categories: DocumentCategoryMap,
  files: Record<string, File[]>
): Promise<{
  success: boolean;
  requestId?: string;
  error?: string;
  fileCount?: number;
}> {
  try {
    // Convert File objects to a format that can be sent to server action
    // We'll upload files via API route first, then pass metadata to action
    
    const uploadedFiles: Record<string, Array<{
      name: string;
      size: number;
      type: string;
      data: string; // base64 encoded
    }>> = {};

    // Convert files to base64 for each document
    for (const [documentId, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        uploadedFiles[documentId] = await Promise.all(
          fileArray.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            // Convert ArrayBuffer to base64 without using Buffer (browser-compatible)
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              data: base64,
            };
          })
        );
      }
    }

    // Call server action with file data
    const result = await submitDocumentRequest({
      requestDetails,
      categories,
      files: uploadedFiles as any, // Type assertion needed due to File vs base64
    });

    return result;
  } catch (error) {
    console.error("Error submitting request with files:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

