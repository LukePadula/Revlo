import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import Nav from "@/components/ui/nav";
import PageHeader from "@/components/ui/core/PageHeader";
import AccountClient from "./AccountClient";
import { getOrganization } from "@/app/actions/getOrganization";
import { getSubscription } from "@/app/actions/getSubscription";

export default async function AccountPage() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch account info
  const accountInfo = {
    name: session.user.name || "User",
    email: session.user.email,
    memberSince: session.user.createdAt
      ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Recently",
  };

  // Fetch organization and subscription
  const orgData = await getOrganization().catch((err) => {
    console.error("Error fetching organization:", err);
    return null;
  });
  const subscription = await getSubscription().catch(() => null);
  console.log(JSON.stringify(subscription), "SUBSCRIPTION");
  // Check if user is owner
  // Try multiple ways to check ownership since the member structure might vary
  let isOwner = false;

  if (orgData?.organization) {
    // Method 1: Check members list for owner role
    if (orgData.members && orgData.members.length > 0) {
      isOwner = orgData.members.some((m: any) => {
        // Check both userId and user.id fields
        const memberUserId = m.userId || m.user?.id;
        const isMatch = memberUserId === session.user.id;
        const isOwnerRole = m.role === "owner";

        if (isMatch && isOwnerRole) {
          console.log("✅ Found owner match:", {
            member: m,
            userId: session.user.id,
            memberUserId,
            role: m.role,
          });
        }

        return isMatch && isOwnerRole;
      });
    }

    // Method 2: If no members found or user not in members, check if user created the organization
    // (organization creator is typically the owner)
    if (!isOwner) {
      const org = orgData.organization as any;
      if (
        org.createdBy === session.user.id ||
        org.createdById === session.user.id
      ) {
        isOwner = true;
        console.log("✅ User is organization creator (owner)");
      }
    }

    // Method 3: If user is the only member or organization exists, assume owner for now
    // This is a fallback - in production you'd want stricter checks
    if (!isOwner && orgData.members && orgData.members.length === 1) {
      const member = orgData.members[0] as any;
      const memberUserId = member.userId || member.user?.id;
      if (memberUserId === session.user.id) {
        isOwner = true;
        console.log("✅ User is the only member (assuming owner)");
      }
    }
  }

  // Debug logging
  console.log("🔍 Organization ownership check:", {
    hasOrg: !!orgData,
    orgId: orgData?.organization?.id,
    orgCreatedBy: (orgData?.organization as any)?.createdBy,
    orgCreatedById: (orgData?.organization as any)?.createdById,
    memberCount: orgData?.members?.length || 0,
    currentUserId: session.user.id,
    members: orgData?.members?.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      user: m.user,
      role: m.role,
      memberUserId: m.userId || m.user?.id,
      matchesCurrentUser: (m.userId || m.user?.id) === session.user.id,
    })),
    isOwner,
  });

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
              accountInfo={accountInfo}
              subscription={subscription}
              organization={orgData?.organization || null}
              members={orgData?.members || []}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </>
  );
}
