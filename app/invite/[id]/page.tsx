"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/ui/nav";
import PageCard from "@/components/ui/core/pageCard";
import Button from "@/components/ui/core/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/landing/Logo.png";

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {
    if (!invitationId) {
      setStatus("error");
      setMessage("Invalid invitation link");
      return;
    }

    handleAcceptInvitation();
  }, [invitationId]);

  const handleAcceptInvitation = async () => {
    try {
      const response = await fetch(`/api/invite/${invitationId}`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // User not logged in, redirect to login with invitation ID
          router.push(`/login?invite=${invitationId}`);
          return;
        }
        
        if (data.error === "expired") {
          setStatus("expired");
          setMessage("This invitation has expired. Please contact the organization owner for a new invitation.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to accept invitation");
        }
        return;
      }

      setStatus("success");
      setOrganizationName(data.organizationName || "");
      setMessage("You have successfully joined the organization!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/portal/dashboard");
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "An error occurred while accepting the invitation");
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src={Logo}
                alt="Revlo logo"
                className="w-12 h-12 object-cover"
                width={48}
                height={48}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Organization Invitation
            </h1>
          </div>

          <PageCard>
            <div className="space-y-6 text-center">
              {status === "loading" && (
                <>
                  <Loader2 className="w-12 h-12 text-brand mx-auto animate-spin" />
                  <p className="text-gray-600">Processing your invitation...</p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome to {organizationName}!
                    </h2>
                    <p className="text-gray-600">{message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Redirecting you to the dashboard...
                    </p>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Unable to Accept Invitation
                    </h2>
                    <p className="text-gray-600">{message}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      label="Go to Dashboard"
                      variant="brand"
                      onClick={() => router.push("/portal/dashboard")}
                      fullWidth
                    />
                    <Button
                      label="Go to Login"
                      variant="outline"
                      onClick={() => router.push("/login")}
                      fullWidth
                    />
                  </div>
                </>
              )}

              {status === "expired" && (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Invitation Expired
                    </h2>
                    <p className="text-gray-600">{message}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      label="Go to Dashboard"
                      variant="brand"
                      onClick={() => router.push("/portal/dashboard")}
                      fullWidth
                    />
                    <Button
                      label="Go to Login"
                      variant="outline"
                      onClick={() => router.push("/login")}
                      fullWidth
                    />
                  </div>
                </>
              )}
            </div>
          </PageCard>
        </div>
      </div>
    </>
  );
}

