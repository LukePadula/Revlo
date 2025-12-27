import { getRequestById } from "@/app/actions/getRequestById";
import RequestClientWrapper from "./RequestClientWrapper";
import { notFound } from "next/navigation";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const requestId = params?.id;

  if (!requestId) {
    notFound();
  }

  const requestRecord = await getRequestById(requestId);

  if (!requestRecord) {
    notFound();
  }

  return (
    <RequestClientWrapper initialRecord={requestRecord} requestId={requestId} />
  );
}
