"use client";

import { useState } from "react";
import Nav from "@/components/ui/nav";
import PageHeader from "@/components/ui/core/PageHeader";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import ModifyRequestDetails from "@/components/ui/portal/ModifyRequestDetails";
import ModifyRequestDocuments from "@/components/ui/portal/ModifyRequestedDocument";
import Button from "@/components/ui/core/button";
import { ErrorMap, DocListType } from "@/types";
import { createNewRequest } from "@/app/actions/createNewRequest";
import { validateRequestDetails } from "@/app/lib/zod/validationHelpers";
import { useRouter } from "next/navigation";

export default function NewRequestClient({ session }: { session: any }) {
  const router = useRouter();
  const record = useModifyRequestStore((s) => s.docRequest);

  const [validation, setValidation] = useState({
    isValid: true,
    errors: {} as ErrorMap,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRecipients = (): ErrorMap => {
    const errors: ErrorMap = {};
    const recipients = record.recipients || [];

    // Check if recipients array exists and has at least one valid recipient
    if (!recipients || recipients.length === 0) {
      // Fallback to legacy fields
      if (!record.recipientName || !record.email) {
        errors.recipients =
          "At least one recipient with name and email is required";
        return errors;
      }
      // Validate legacy fields
      if (!record.recipientName.trim()) {
        errors.recipientName = "Recipient name is required";
      }
      if (!record.email.trim()) {
        errors.email = "Recipient email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
        errors.email = "Please enter a valid email address";
      }
      return errors;
    }

    // Validate each recipient
    const validRecipients = recipients.filter(
      (r) => r && r.name && r.name.trim() && r.email && r.email.trim()
    );

    if (validRecipients.length === 0) {
      errors.recipients =
        "At least one recipient with name and email is required";
      return errors;
    }

    // Check each recipient for valid email
    recipients.forEach((recipient, index) => {
      if (!recipient.name || !recipient.name.trim()) {
        errors[`recipientName_${index}`] = "Recipient name is required";
      }
      if (!recipient.email || !recipient.email.trim()) {
        errors[`email_${index}`] = "Recipient email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.email)) {
        errors[`email_${index}`] = "Please enter a valid email address";
      }
    });

    return errors;
  };

  const validateCategoriesAndDocuments = (): ErrorMap => {
    const errors: ErrorMap = {};
    const categoryData = useModifyRequestStore.getState().categoryData;

    const selectedCategories = Object.entries(categoryData).filter(
      ([_, category]) => category.selected
    );

    if (selectedCategories.length === 0) {
      errors.categories = "Please select at least one document category";
      return errors;
    }

    let hasSelectedDocument = false;
    for (const [_, category] of selectedCategories) {
      const selectedDocuments = category.requestedDocumentList.filter(
        (doc: DocListType) => doc.selected
      );
      if (selectedDocuments.length > 0) {
        hasSelectedDocument = true;
        break;
      }
    }

    if (!hasSelectedDocument) {
      errors.documents =
        "Please select at least one document from the selected categories";
    }

    return errors;
  };

  const handleSend = async () => {
    record.createdBy = session.session.userId;
    const documentRequest = {
      id: null,
      requestDetails: record,
      requestedCategories: {} as any,
      dataPolicy: { encrypt: true, autoDeletePeriod: "", auditTrail: true },
      audit: { created: null, viewed: null, submitted: null },
    };

    const result = validateRequestDetails(documentRequest);
    const recipientErrors = validateRecipients();
    const categoryErrors = validateCategoriesAndDocuments();

    const allErrors = {
      ...result.errors,
      ...recipientErrors,
      ...categoryErrors,
    };
    const isValid =
      result.isValid &&
      Object.keys(recipientErrors).length === 0 &&
      Object.keys(categoryErrors).length === 0;

    setValidation({ isValid, errors: allErrors });

    if (!isValid) {
      console.log("Validation failed:", allErrors);
      const firstErrorKey = Object.keys(allErrors)[0];

      if (firstErrorKey) {
        const element = document.querySelector(
          `[data-error-field="${firstErrorKey}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // If error is for categories/documents, scroll to document selector section
          const documentSection = document.querySelector(
            '[data-section="documents"]'
          );
          documentSection?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return;
    }

    const categoryData = useModifyRequestStore.getState().categoryData;
    const selectedCategoryData = Object.fromEntries(
      Object.entries(categoryData).filter(([_, v]) => v.selected)
    );

    setIsSubmitting(true);
    try {
      const response = await createNewRequest(
        record,
        selectedCategoryData as any
      );
      console.log("Request created successfully:", response);

      router.push("/portal/dashboard");
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Failed to create request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
      <Nav />
      <div className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <PageHeader
              title="New Document Request"
              subtitle="Create a secure document collection link and share it with your customers"
            >
              <div className="flex gap-2 w-full">
                <Button
                  label={isSubmitting ? "Sending..." : "Send"}
                  variant="brand"
                  iconName="send"
                  onClick={handleSend}
                  size="medium"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </PageHeader>
          </div>

          <ModifyRequestDetails
            requestDetails={record}
            errors={validation.errors}
          />

          <ModifyRequestDocuments
            categories={{} as any}
            errors={validation.errors}
          />
        </div>
      </div>
    </div>
  );
}
