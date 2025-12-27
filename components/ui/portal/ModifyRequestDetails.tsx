"use client";
import { useState, useEffect } from "react";
import PageCard from "../core/pageCard";
import Icon from "../core/icon";
import { RequestDetails, Recipient } from "@/types";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import { Mail, User, FileText, Plus, X } from "lucide-react";

interface Props {
  requestDetails: RequestDetails;
  errors?: Record<string, string>;
}

export default function ModifyRequestDetails({
  requestDetails,
  errors,
}: Props) {
  const updateRequestDetails = useModifyRequestStore(
    (s) => s.updateRequestDetails
  );

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    if (requestDetails.recipients && requestDetails.recipients.length > 0) {
      return requestDetails.recipients;
    }
    if (requestDetails.recipientName && requestDetails.email) {
      return [
        { name: requestDetails.recipientName, email: requestDetails.email },
      ];
    }
    return [{ name: "", email: "" }];
  });

  // Sync recipients to store whenever they change
  useEffect(() => {
    updateRequestDetails("recipients", recipients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipients]);

  const addRecipient = () => {
    setRecipients([...recipients, { name: "", email: "" }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index));
    }
  };

  const updateRecipient = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  return (
    <PageCard
      title="Request Details"
      subtitle="Configure the basic information for your document request"
      headerVariant="neutral"
      icon={<Icon iconName="file-text" variant="brand" size="medium" />}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 max-w-md md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Request Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requestDetails.title}
                  placeholder="e.g., Employment Verification Documents"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors?.["title"]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  required
                  onChange={(e) =>
                    updateRequestDetails("title", String(e.target.value))
                  }
                />
                {errors?.["title"] && (
                  <p className="text-red-600 text-xs font-medium">
                    {errors["title"]}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  A clear title helps recipients understand what documents are
                  needed
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <FileText className="w-4 h-4 text-gray-500" />
                Purpose
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={requestDetails.purpose}
                placeholder="e.g., Required for employment verification and background check process"
                rows={3}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
                  errors?.["purpose"]
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                required
                onChange={(e) =>
                  updateRequestDetails("purpose", String(e.target.value))
                }
              />
              {errors?.["purpose"] && (
                <p className="text-red-600 text-xs font-medium">
                  {errors["purpose"]}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Explain why you need these documents
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0.5">
                <User className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Recipients
                </h3>

                <span className="text-xs text-gray-500 font-normal">
                  ({recipients.length}
                  {recipients.length === 1 ? " recipient" : " recipients"})
                </span>
              </div>
              <div>
                <p className="ml-1 text-xs text-gray-500 flex justify-center gap-1">
                  A seperate request link will be sent to all recipients listed
                  below
                </p>
              </div>
            </div>
            <button
              onClick={addRecipient}
              className="flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              type="button"
            >
              <Plus size={14} />
              Add Recipient
            </button>
          </div>

          <div className="space-y-4">
            {recipients.map((recipient, index) => (
              <div
                key={`recipient-${index}-${recipient.email || index}`}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Recipient {index + 1}
                    </span>
                  </div>
                  {recipients.length > 1 && (
                    <button
                      onClick={() => removeRecipient(index)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      type="button"
                      aria-label="Remove recipient"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <User className="w-4 h-4 text-gray-500" />
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={recipient.name}
                      placeholder="e.g., John Doe"
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors?.[`recipientName_${index}`] ||
                        errors?.["recipientName"]
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      required
                      onChange={(e) =>
                        updateRecipient(index, "name", e.target.value)
                      }
                    />
                    {(errors?.[`recipientName_${index}`] ||
                      (errors?.["recipientName"] && index === 0)) && (
                      <p className="text-red-600 text-xs font-medium">
                        {errors[`recipientName_${index}`] ||
                          errors["recipientName"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email Address
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={recipient.email}
                      placeholder="e.g., john.doe@example.com"
                      className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors?.[`email_${index}`] || errors?.["email"]
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      required
                      onChange={(e) =>
                        updateRecipient(index, "email", e.target.value)
                      }
                    />
                    {(errors?.[`email_${index}`] ||
                      (errors?.["email"] && index === 0)) && (
                      <p className="text-red-600 text-xs font-medium">
                        {errors[`email_${index}`] || errors["email"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageCard>
  );
}
