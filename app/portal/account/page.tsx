import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import Nav from "@/components/ui/nav";
import PageHeader from "@/components/ui/core/PageHeader";
import AccountClient from "./AccountClient";
import { getOrganization } from "@/app/actions/getOrganization";
import { getSubscription } from "@/app/actions/getSubscription";
import { log } from "node:console";

export default async function AccountPage() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect("/login");
  }

  const userInfo = {
    name: session.user.name || "User",
    email: session.user.email,
    memberSince: session.user.createdAt
      ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Recently",
  };

  let orgData = null;
  try {
    orgData = await getOrganization();
  } catch (err) {
    console.error("Error fetching organization:", err);
  }

  let isOwner = orgData?.organization.id === session.user.id;

  console.log(isOwner, "IS OWNER");
  console.log(orgData, "ID");

  if (
    orgData?.members &&
    Array.isArray(orgData.members) &&
    orgData.members.length > 0
  ) {
    const currentUserMember = orgData.members.find(
      (member: any) =>
        member.userId === session.user.id ||
        member.user?.id === session.user.id ||
        (member.user &&
          typeof member.user === "object" &&
          member.user.id === session.user.id)
    );
    isOwner = currentUserMember?.role === "owner";
  }

  // Also check if user has an organizationId (they belong to an org)
  const hasOrganization =
    !!(session.user as any).organisationId || !!orgData?.organization;

  // Fetch subscription if user is owner or has organization
  let subscription = null;
  if (hasOrganization) {
    subscription = await getSubscription().catch(() => null);
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
        <div className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
              title="Account Settings"
              subtitle="Manage your account settings and subscription"
            />
            <AccountClient
              accountInfo={userInfo}
              subscription={
                subscription
                  ? {
                      ...subscription,
                      trialEnd:
                        subscription.trialEnd instanceof Date
                          ? subscription.trialEnd.getTime()
                          : subscription.trialEnd,
                    }
                  : null
              }
              organization={
                orgData?.organization
                  ? {
                      id: orgData.organization.id,
                      name: (orgData.organization as any).name || "",
                      slug: (orgData.organization as any).slug || "",
                      createdAt: (orgData.organization as any).createdAt
                        ? new Date((orgData.organization as any).createdAt)
                        : new Date(),
                      updatedAt: (orgData.organization as any).updatedAt
                        ? new Date((orgData.organization as any).updatedAt)
                        : new Date(),
                    }
                  : null
              }
              members={orgData?.members || []}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </>
  );
}
