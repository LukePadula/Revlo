"use client";

import { useState } from "react";
import PageCard from "@/components/ui/core/pageCard";
import Button from "@/components/ui/core/button";
import {
  User,
  Mail,
  CreditCard,
  Bell,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  Settings,
  Crown,
  Trash2,
  Edit,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface AccountInfo {
  name: string;
  email: string;
  memberSince: string;
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd: number | null;
  quantity: number;
  price: {
    amount: number;
    currency: string;
    interval: string;
  } | null;
}

interface OrganizationMember {
  id: string;
  userId: string;
  role: "owner" | "admin" | "member";
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: number | Date;
  updatedAt: number | Date;
}

interface Props {
  accountInfo: AccountInfo;
  subscription: Subscription | null;
  organization: Organization | null;
  members: OrganizationMember[];
  isOwner: boolean;
}

export default function AccountClient({
  accountInfo,
  subscription,
  organization,
  members,
  isOwner,
}: Props) {
  const [activeTab, setActiveTab] = useState<"account" | "organization">(
    "account"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [orgName, setOrgName] = useState(organization?.name || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  console.log(JSON.stringify(subscription), "SUBSCRIPTION");

  const handleUpdateOrganization = async () => {
    if (!organization) return;
    try {
      const { updateOrganization } = await import(
        "@/app/actions/manageOrganizationMember"
      );
      await updateOrganization(organization.id, orgName);
      setIsEditingOrg(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to update organization");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!organization) return;
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const { removeMember } = await import(
        "@/app/actions/manageOrganizationMember"
      );
      await removeMember(organization.id, memberId);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to remove member");
    }
  };

  const handleUpdateRole = async (
    memberId: string,
    role: "owner" | "admin" | "member"
  ) => {
    if (!organization) return;

    try {
      const { updateMemberRole } = await import(
        "@/app/actions/manageOrganizationMember"
      );
      await updateMemberRole(organization.id, memberId, role);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to update role");
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      setInviteError("Please enter an email address");
      return;
    }

    if (!inviteEmail.includes("@")) {
      setInviteError("Please enter a valid email address");
      return;
    }

    setIsInviting(true);
    setInviteError("");
    setInviteSuccess("");

    try {
      const { inviteUser } = await import("@/app/actions/inviteUser");
      const result = await inviteUser(inviteEmail.trim(), inviteRole);

      setInviteSuccess(result.message || "User invited successfully");
      setInviteEmail("");

      // Refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      setInviteError(error.message || "Failed to invite user");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50">
      <div className="w-full   pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "account"
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Account
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab("organization")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "organization"
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Organization
              </button>
            )}
          </div>

          {activeTab === "account" && (
            <>
              {/* Account Information */}
              <PageCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-brand" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {accountInfo.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {accountInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-900">
                          {accountInfo.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Member Since
                        </p>
                        <p className="text-sm text-gray-900">
                          {accountInfo.memberSince}
                        </p>
                      </div>
                    </div>

                    {organization && (
                      <div className="flex items-start gap-3 md:col-span-2">
                        <Globe className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Organization
                          </p>
                          <p className="text-sm text-gray-900">
                            {organization.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </PageCard>
              <PageCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Settings
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-xs text-gray-500">
                            Receive notifications about your document requests
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(e) =>
                            setNotificationsEnabled(e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-xs text-gray-500">
                            Receive email updates about your account
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) =>
                            setEmailNotifications(e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-4">
                      Security
                    </p>
                    <div className="space-y-3">
                      <Button
                        label="Change Password"
                        variant="outline"
                        iconName="lock"
                        size="medium"
                        fullWidth
                      />
                      <Button
                        label="Two-Factor Authentication"
                        variant="outline"
                        iconName="shield"
                        size="medium"
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </PageCard>
            </>
          )}

          {activeTab === "organization" && isOwner && organization && (
            <>
              {/* Organization Settings */}
              <PageCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Organization Settings
                        </h2>
                        <p className="text-sm text-gray-600">
                          Manage your organization details
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Organization Name
                      </label>
                      {isEditingOrg ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none"
                          />
                          <Button
                            label="Save"
                            variant="brand"
                            size="small"
                            onClick={handleUpdateOrganization}
                          />
                          <Button
                            label="Cancel"
                            variant="outline"
                            size="small"
                            onClick={() => {
                              setIsEditingOrg(false);
                              setOrgName(organization.name);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-sm text-gray-900">
                            {organization.name}
                          </span>
                          <button
                            onClick={() => setIsEditingOrg(true)}
                            className="text-brand hover:text-brand/80"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Organization Slug
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600">
                          {organization.slug}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PageCard>

              {/* Plan Information */}
              {subscription && (
                <PageCard>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Plan & Billing
                          </h2>
                          <p className="text-sm text-gray-600">
                            Manage your subscription
                          </p>
                        </div>
                      </div>
                    </div>
                    {subscription.trialEnd &&
                      subscription.trialEnd > Date.now() && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                Free Trial Active
                              </p>
                              <p className="text-xs text-blue-700">
                                Trial ends on{" "}
                                {new Date(
                                  subscription.trialEnd
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Licenses
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {subscription.quantity}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Active licenses
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Monthly Cost
                        </p>
                        {subscription.price && (
                          <>
                            <p className="text-xl font-bold text-gray-900">
                              £
                              {subscription.price.amount *
                                subscription.quantity}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              £{subscription.price.amount} per license
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Subscription Start
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(
                              subscription.currentPeriodStart
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Next Billing Date
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(
                              subscription.currentPeriodEnd
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    {subscription.cancelAtPeriodEnd && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="text-sm font-medium text-yellow-900">
                              Subscription Cancelled
                            </p>
                            <p className="text-xs text-yellow-700">
                              Your subscription will end on{" "}
                              {new Date(
                                subscription.currentPeriodEnd
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </PageCard>
              )}

              {/* Invite User Section */}
              <PageCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Invite Team Member
                        </h2>
                        <p className="text-sm text-gray-600">
                          Add new members to your organization
                        </p>
                      </div>
                    </div>
                  </div>

                  {inviteError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{inviteError}</p>
                    </div>
                  )}

                  {inviteSuccess && (
                    <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-800">{inviteSuccess}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => {
                            setInviteEmail(e.target.value);
                            setInviteError("");
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleInviteUser();
                            }
                          }}
                          placeholder="Enter email address"
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-colors text-sm"
                          disabled={isInviting}
                        />
                      </div>
                    </div>
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(e.target.value as "admin" | "member")
                      }
                      className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none text-sm"
                      disabled={isInviting}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      label={isInviting ? "Inviting..." : "Invite"}
                      variant="brand"
                      size="small"
                      onClick={handleInviteUser}
                      disabled={isInviting || !inviteEmail.trim()}
                      loading={isInviting}
                    />
                  </div>
                </div>
              </PageCard>

              {/* Members Management */}
              <PageCard>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Team Members
                        </h2>
                        <p className="text-sm text-gray-600">
                          {members.length} member
                          {members.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-brand" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.user.name || member.user.email}
                            </p>
                            <p className="text-xs text-gray-600">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {member.role === "owner" && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                              <Crown className="w-3 h-3" />
                              Owner
                            </span>
                          )}
                          {member.role === "admin" && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                              Admin
                            </span>
                          )}
                          {member.role === "member" && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                              Member
                            </span>
                          )}
                          {member.role !== "owner" && (
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleUpdateRole(
                                  member.userId,
                                  e.target.value as "owner" | "admin" | "member"
                                )
                              }
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                          {member.role !== "owner" && (
                            <button
                              onClick={() => handleRemoveMember(member.userId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PageCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
