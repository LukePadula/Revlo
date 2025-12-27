// app/portal/request/view/page.tsx (Server Component)

import { getRequestById } from "@/app/actions/getRequestById";
import { notFound } from "next/navigation";
import RequestViewClient from "./RequestViewClient";

// Make the component async to await the data fetch
export default async function RequestViewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  // Get ID from query parameters (await the Promise in Next.js 15+)
  const params = await searchParams;
  const requestId = params?.id;

  if (!requestId) {
    notFound();
  }

  // Fetch data directly on the server
  const requestRecord = await getRequestById(requestId);

  // Handle case where request is not found
  if (!requestRecord) {
    notFound();
  }

  return <RequestViewClient request={requestRecord} requestId={requestId} />;
}

