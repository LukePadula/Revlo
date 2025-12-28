"use client";
import Nav from "../ui/nav";
import Icon from "../ui/core/icon";
import SubmissionConfirmation from "../ui/submissionConfirmation";
import DocumentCategoryUploadContainer from "../ui/requestUploader/DocumentCategoryUploadContainer";
import PageHeader from "../ui/core/PageHeader";
import { DocumentCategoryMap } from "@/types";

interface RequestLinkProps {
  record: {
    requestDetails: {
      purpose: string;
      expires: string;
      title?: string;
      requestedBy?: string;
    };
    requestedCategories: DocumentCategoryMap;
  };
}

export default function RequestLink({ record }: RequestLinkProps) {
  const data = record;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50/30">
      <Nav />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <div className="mb-8">
            <PageHeader
              title="Complete Your Request"
              subtitle="Please securely upload the required documents below to complete your submission."
            />
          </div>

          {/* Request Overview Card */}
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* Request Details Section */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-brand/10 rounded-lg">
                    <Icon iconName="file-text" size="small" variant="brand" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-brand uppercase tracking-wider">
                      Request Details
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Information about this request
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data.requestDetails.title && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                        Title
                      </p>
                      <p className="text-base font-semibold text-gray-900 leading-snug">
                        {data.requestDetails.title}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                      Purpose
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {data.requestDetails.purpose}
                    </p>
                  </div>
                  {data.requestDetails.requestedBy && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                        Requested By
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {data.requestDetails.requestedBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Deadline Section */}
              <div className="p-6 lg:p-8 bg-linear-to-br from-gray-50/50 to-white">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Icon iconName="calendar" size="small" variant="neutral" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                      EXPIRES
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Document due date
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">
                    {data.requestDetails.expires}
                  </p>
                  <p className="text-xs text-gray-500">
                    Please submit before this date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-blue-50/80 border border-blue-200/60 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
              <Icon iconName="shield" size="small" variant="brand" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 mb-1.5">
                Security & Privacy
              </h3>
              <div className="space-y-1.5 text-xs text-blue-800 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    <strong className="font-semibold">
                      Full document encryption:
                    </strong>{" "}
                    All uploaded documents are encrypted using industry-standard
                    encryption.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    <strong className="font-semibold">
                      Automatic deletion:
                    </strong>{" "}
                    Documents can be held by the customer for a maximum of 2
                    years before automatic deletion, if not deleted earlier.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Document Upload Container */}
        <section className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-6 sm:px-8 lg:px-10 py-6 border-b border-gray-100 bg-linear-to-r from-gray-50/80 via-white to-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Required Documents
                  </h2>
                  <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
                    <Icon iconName="lock" size="small" variant="success" />
                    <span>Secure</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload all requested files to proceed with your submission
                </p>
              </div>
            </div>
          </div>

          {/* Document Upload Area */}
          <div className="p-6 sm:p-8 lg:p-10 bg-gray-50/30">
            <DocumentCategoryUploadContainer
              categories={data.requestedCategories}
            />
          </div>

          {/* Submission Footer */}
          <footer className="px-6 sm:px-8 lg:px-10 py-8 bg-white border-t border-gray-100">
            <div className="max-w-2xl">
              <SubmissionConfirmation />
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
