import { log } from "console";

export async function createRequest(data: any) {
  console.log(process.env.DOC_API_URL);

  const res = await fetch("http://localhost:3000/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create request");
  }

  return res.json();
}

export async function getRequestId(id: string) {
  console.log(process.env.DOC_API_URL);

  const res = await fetch(`http://localhost:3000/api/request/id?${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create request");
  }

  return res.json();
}

import { getRequests as getRequestsAction } from "@/app/actions/getRequests";

export async function getRequests() {
  try {
    return await getRequestsAction();
  } catch (error) {
    console.error("Failed to get requests:", error);
    throw error;
  }
}
