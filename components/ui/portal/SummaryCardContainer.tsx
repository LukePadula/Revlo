"use client";
import SummaryCard from "./SummaryCard";
import DocumentIcon from "@/components/ui/core/documentIcon";
import { DocumentRequest } from "@/types";
import { useMemo } from "react";

interface Props {
  requests: DocumentRequest[];
}

export default function SummaryCardContainer({ requests }: Props) {
  const stats = useMemo(() => {
    const open = requests.filter(
      (r) =>
        !r.requestDetails?.status ||
        r.requestDetails.status.toLowerCase() === "open" ||
        r.requestDetails.status.toLowerCase() === "active"
    ).length;

    const pending = requests.filter(
      (r) =>
        r.requestDetails?.status?.toLowerCase() === "pending" ||
        r.requestDetails?.status?.toLowerCase() === "review"
    ).length;

    const total = requests.length;

    return { open, pending, total };
  }, [requests]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Open Requests"
        value={stats.open.toString()}
        icon={
          <DocumentIcon iconName="clock" colourVariant="blue" shape="circle" />
        }
      />
      <SummaryCard
        title="Pending Review"
        value={stats.pending.toString()}
        icon={
          <DocumentIcon iconName="eye" colourVariant="orange" shape="circle" />
        }
      />
      <SummaryCard
        title="Total Requests"
        value={stats.total.toString()}
        icon={
          <DocumentIcon
            iconName="file-text"
            colourVariant="purple"
            shape="circle"
          />
        }
      />
    </div>
  );
}
