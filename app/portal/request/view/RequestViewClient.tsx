"use client";

import { useRouter } from "next/navigation";
import Nav from "@/components/ui/nav";
import PageHeader from "@/components/ui/core/PageHeader";
import PageCard from "@/components/ui/core/pageCard";
import { Calendar, Mail, FileText } from "lucide-react";
import Button from "@/components/ui/core/button";
import { DocumentRequest } from "@/types";

interface Props {
  request: DocumentRequest;
  requestId: string;
}

export default function RequestViewClient({ request, requestId }: Props) {
  const router = useRouter();
  const requestDetails = request.requestDetails;

  const getStatusBadgeClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === "open" || statusLower === "active") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (statusLower === "pending" || statusLower === "review") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    if (statusLower === "closed" || statusLower === "completed") {
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatStatus = (status: string): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const recipients =
    requestDetails?.recipients && requestDetails.recipients.length > 0
      ? requestDetails.recipients
      : requestDetails?.email
      ? [{ name: requestDetails.recipientName || "N/A", email: requestDetails.email }]
      : [];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
        <div className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-2">
              <Button
                label="Back"
                variant="outline"
                iconName="arrow-left"
                onClick={() => router.push("/portal/dashboard")}
                size="small"
              />
              <PageHeader
                title="Request Details"
                subtitle="View document request information and status"
              />
            </div>

            {/* Request Overview Card */}
            <PageCard>
              <div className="space-y-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-200">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {requestDetails?.title || "Untitled Request"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Request ID: {requestId}
                    </p>
                  </div>
                  {requestDetails?.status && (
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        requestDetails.status
                      )}`}
                    >
                      {formatStatus(requestDetails.status)}
                    </span>
                  )}
                </div>

                {/* Request Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recipients */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Recipients
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {recipients.length > 0 ? (
                        recipients.map((recipient, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {recipient.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {recipient.email}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No recipients</p>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Expires
                      </h3>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {requestDetails?.expires || "No expiry"}
                      </p>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Purpose
                      </h3>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {requestDetails?.purpose || "No purpose specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Link Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Request Link
                      </h3>
                      <p className="text-xs text-gray-600">
                        Share this link with recipients to collect documents
                      </p>
                    </div>
                    <Button
                      label="View Request"
                      variant="brand"
                      iconName="external-link"
                      onClick={() => {
                        const baseUrl =
                          typeof window !== "undefined"
                            ? window.location.origin
                            : "";
                        window.open(`${baseUrl}/request?id=${requestId}`, "_blank");
                      }}
                      size="medium"
                    />
                  </div>
                </div>
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </>
  );
}

