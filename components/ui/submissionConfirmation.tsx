"use client";

import { useState } from "react";
import Button from "./core/button";
import Checkbox from "./core/inputs/Checkbox";
import { useRequestStore } from "@/store/requestStore";
import { submitDocumentRequest } from "@/app/actions/submitDocumentRequest";
import { useRouter } from "next/navigation";

export default function SubmissionConfirmation() {
  const router = useRouter();
  const requestData = useRequestStore((s) => s.requestData);
  const fileData = useRequestStore((s) => s.fileData);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      setError("Please confirm the authenticity of your documents");
      return;
    }

    if (!requestData) {
      setError("Request data not found");
      return;
    }

    // Check if any files are uploaded
    const hasFiles = Object.values(fileData).some((files) => files.length > 0);
    if (!hasFiles) {
      setError("Please upload at least one document before submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Convert Files to base64 format
      const filesForSubmission: Record<
        string,
        Array<{
          name: string;
          size: number;
          type: string;
          data: string; // base64
        }>
      > = {};

      // Helper function to convert ArrayBuffer to base64
      const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };

      for (const [documentId, files] of Object.entries(fileData)) {
        if (files.length > 0) {
          filesForSubmission[documentId] = await Promise.all(
            files.map(async (file) => {
              const arrayBuffer = await file.arrayBuffer();
              const base64 = arrayBufferToBase64(arrayBuffer);
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

      // Call the server action with existing request ID
      const result = await submitDocumentRequest({
        requestDetails: requestData.requestDetails,
        categories: requestData.requestedCategories,
        files: filesForSubmission,
        requestId: requestData.id || undefined, // Use existing request ID
      });

      if (result.success) {
        // Redirect to success page or show success message
        router.push(`/request/submitted?id=${result.requestId}`);
      } else {
        setError("Failed to submit documents. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center md:items-end space-y-4">
      <Checkbox
        description="I confirm that all uploaded documents and provided information is
        authentic and I consent to the processing of this information for the
        stated purpose."
        checked={isConfirmed}
        onChange={setIsConfirmed}
      />
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-col w-52 md:flex-row max-w-xs items-center justify-center">
        <Button
          iconName="send"
          variant="brand"
          label="Submit Documents"
          fullWidth={true}
          onClick={handleSubmit}
          disabled={!isConfirmed || isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}
