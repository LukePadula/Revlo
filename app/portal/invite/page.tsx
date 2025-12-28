"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "@/components/ui/nav";
import PageHeader from "@/components/ui/core/PageHeader";
import PageCard from "@/components/ui/core/pageCard";
import Button from "@/components/ui/core/button";
import { Mail, UserPlus, X, CheckCircle2, AlertCircle } from "lucide-react";

interface InvitedUser {
  email: string;
  role: "admin" | "member";
}

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const licenseCount = parseInt(searchParams.get("licenses") || "1");

  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate how many more users can be invited
  const maxInvites = licenseCount - 1; // -1 for the owner
  const remainingInvites = maxInvites - invitedUsers.length;

  const handleAddInvite = () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (invitedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("This email has already been added");
      return;
    }

    if (invitedUsers.length >= maxInvites) {
      setError(`You can only invite up to ${maxInvites} users`);
      return;
    }

    setInvitedUsers([...invitedUsers, { email: email.trim(), role }]);
    setEmail("");
    setError("");
  };

  const handleRemoveInvite = (index: number) => {
    setInvitedUsers(invitedUsers.filter((_, i) => i !== index));
  };

  const handleSendInvites = async () => {
    if (invitedUsers.length === 0) {
      setError("Please add at least one user to invite");
      return;
    }

    setIsInviting(true);
    setError("");
    setSuccess("");

    try {
      const { inviteUser } = await import("@/app/actions/inviteUser");
      
      const results = await Promise.allSettled(
        invitedUsers.map((user) => inviteUser(user.email, user.role))
      );

      const failed = results.filter((r) => r.status === "rejected");
      const succeeded = results.filter((r) => r.status === "fulfilled");

      if (failed.length > 0) {
        const errorMessages = failed
          .map((r) => (r as PromiseRejectedResult).reason?.message || "Unknown error")
          .join(", ");
        setError(`Failed to invite some users: ${errorMessages}`);
      }

      if (succeeded.length > 0) {
        setSuccess(`Successfully sent ${succeeded.length} invitation(s)`);
        setTimeout(() => {
          router.push("/portal/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send invitations");
    } finally {
      setIsInviting(false);
    }
  };

  const handleSkip = () => {
    router.push("/portal/dashboard");
  };

  // If only 1 license, redirect to dashboard
  useEffect(() => {
    if (licenseCount <= 1) {
      router.push("/portal/dashboard");
    }
  }, [licenseCount, router]);

  if (licenseCount <= 1) {
    return null;
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
        <div className="w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
              title="Invite Team Members"
              subtitle={`You have ${licenseCount} license${licenseCount > 1 ? "s" : ""}. Invite team members to join your organization.`}
            />

            <PageCard>
              <div className="space-y-6">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    You can invite up to <strong>{maxInvites}</strong> team member{maxInvites !== 1 ? "s" : ""}.{" "}
                    {remainingInvites > 0 && (
                      <span className="text-brand">{remainingInvites} invitation{remainingInvites !== 1 ? "s" : ""} remaining.</span>
                    )}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddInvite();
                            }
                          }}
                          placeholder="Enter email address"
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                          disabled={invitedUsers.length >= maxInvites}
                        />
                      </div>
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "admin" | "member")}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-sm"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      label="Add"
                      variant="brand"
                      size="small"
                      onClick={handleAddInvite}
                      disabled={invitedUsers.length >= maxInvites || !email.trim()}
                    />
                  </div>
                </div>

                {invitedUsers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Invitations ({invitedUsers.length}/{maxInvites})
                    </p>
                    <div className="space-y-2">
                      {invitedUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                              <UserPlus className="w-4 h-4 text-brand" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.email}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveInvite(index)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    label="Skip for Now"
                    variant="outline"
                    onClick={handleSkip}
                    fullWidth
                  />
                  <Button
                    label={
                      isInviting
                        ? "Sending..."
                        : invitedUsers.length > 0
                        ? `Send ${invitedUsers.length} Invitation${invitedUsers.length > 1 ? "s" : ""}`
                        : "Continue"
                    }
                    variant="brand"
                    onClick={invitedUsers.length > 0 ? handleSendInvites : handleSkip}
                    fullWidth
                    loading={isInviting}
                    disabled={isInviting}
                  />
                </div>
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </>
  );
}

