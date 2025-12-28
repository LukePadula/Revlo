import { getRequests } from "@/app/actions/getRequests";
import DashboardClient from "./DashboardClient";
import { DocumentRequest } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect("/login");
  }

  let requests: DocumentRequest[] = [];

  try {
    console.log("Fetching requests", session);
    requests = await getRequests(session.session.userId);
  } catch (error) {
    console.error("Failed to fetch requests:", error);
  }

  return <DashboardClient initialRequests={requests} />;
}
