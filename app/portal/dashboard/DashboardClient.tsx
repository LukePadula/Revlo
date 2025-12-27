"use client";
import { useUIStore } from "@/store/uiStore";
import Nav from "@/components/ui/nav";
import Modal from "@/components/ui/core/Modal";
import Button from "@/components/ui/core/button";
import Table from "@/components/ui/core/Table";
import SummaryCardContainer from "@/components/ui/portal/SummaryCardContainer";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/core/PageHeader";
import { useMemo } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import TabSelector from "@/components/ui/core/TabSelector";
import PageCard from "@/components/ui/core/pageCard";
import { DocumentRequest } from "@/types";
import { useEffect } from "react";

interface DashboardClientProps {
  initialRequests: DocumentRequest[];
}

export default function DashboardClient({
  initialRequests,
}: DashboardClientProps) {
  const openModal = useUIStore((s) => s.openCreateRequestModal);
  const closeModal = useUIStore((s) => s.closeCreateRequestModal);
  const isOpen = useUIStore((s) => s.isCreateRequestModalOpen);
  const router = useRouter();
  const setRequests = useDashboardStore((s) => s.setRequests);
  const requests = useDashboardStore((s) => s.requests);
  const activeTab = useDashboardStore((s) => s.activeTab);

  useEffect(() => {
    if (initialRequests) {
      setRequests(initialRequests);
    }
  }, [initialRequests, setRequests]);

  const goToNewRequestScreen = () => {
    router.push("/portal/request/new");
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const status = request.requestDetails?.status?.toLowerCase() || "";
      switch (activeTab) {
        case "open":
          return status === "open" || status === "active" || !status;
        case "pending":
          return status === "pending" || status === "review";
        case "all":
          return true;
        default:
          return true;
      }
    });
  }, [requests, activeTab]);

  const tableData = useMemo(() => {
    return filteredRequests.map((request: DocumentRequest) => ({
      id: request.id,
      data: [
        request.requestDetails?.title || "Untitled",
        request.requestDetails?.email ||
          (request.requestDetails?.recipients &&
          request.requestDetails.recipients.length > 0
            ? request.requestDetails.recipients[0].email
            : "N/A"),
        request.requestDetails?.status || "Unknown",
        request.requestDetails?.expires || "N/A",
      ],
    }));
  }, [filteredRequests]);

  const handleRowClick = (requestId: string | null) => {
    if (requestId) {
      router.push(`/portal/request/view?id=${requestId}`);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
        <div className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <PageHeader
                title="Document Request Dashboard"
                subtitle="Manage your document requests and generate new access links"
              />
              <Button
                label="Create document request"
                variant="brand"
                iconName="plus"
                onClick={goToNewRequestScreen}
                size="medium"
              />
            </div>

            <SummaryCardContainer requests={requests} />

            <PageCard>
              <TabSelector />
              <Table
                headers={["Title", "Email", "Status", "Expires"]}
                data={tableData.map((item) => item.data)}
                emptyMessage={`No ${activeTab} requests found.`}
                onRowClick={(index) =>
                  handleRowClick(tableData[index]?.id || null)
                }
              />
            </PageCard>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal onClose={closeModal}>
          <div className="p-6">
            <h2 className="font-bold text-lg mb-2">Create Request</h2>
            <p className="text-sm text-gray-600 mb-4">
              Fill out the details for the new document request.
            </p>

            <Button
              label="Close"
              variant="neutral"
              iconName="x"
              onClick={closeModal}
              fullWidth
            />
          </div>
        </Modal>
      )}
    </>
  );
}
