"use client";

import { useState, useEffect } from "react";
import Nav from "../nav";
import PageHeader from "../core/PageHeader";
import Button from "../core/button";
import Icon from "../core/icon";
import {
  sendEmailVerification,
  verifyOtp,
} from "@/app/lib/api/emailVerification";
import { RequestDetails } from "@/types";

interface OtpVerificationProps {
  requestId: string;
  requestDetails: RequestDetails;
  onVerified: () => void;
}

export default function OtpVerification({
  requestId,
  requestDetails,
  onVerified,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get recipient email (from recipients array or legacy email field)
  const recipientEmail =
    requestDetails.recipients && requestDetails.recipients.length > 0
      ? requestDetails.recipients[0].email
      : requestDetails.email || "your email";

  // Auto-send OTP when component mounts
  useEffect(() => {
    const sendOtpOnMount = async () => {
      try {
        setIsSending(true);
        setError(null);
        await sendEmailVerification(requestId);
        setOtpSent(true);
        setCountdown(60); // 60 second countdown
      } catch (err) {
        setError("Failed to send OTP. Please try again.");
        console.error("Error sending OTP:", err);
      } finally {
        setIsSending(false);
      }
    };

    sendOtpOnMount();
  }, [requestId]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    try {
      setIsSending(true);
      setError(null);
      await sendEmailVerification(requestId);
      setOtpSent(true);
      setCountdown(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      console.error("Error resending OTP:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await verifyOtp(requestId, otp);
      onVerified();
    } catch (err: any) {
      setError(
        err.message?.includes("401") || err.message?.includes("Access Denied")
          ? "Invalid OTP code. Please try again."
          : "Failed to verify OTP. Please try again."
      );
      console.error("Error verifying OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100/50">
      <Nav />

      <main className="pt-24 pb-18 px-3 sm:px-6 lg:px-6 max-w-lg mx-auto">
        <PageHeader
          title="Email Verification Required"
          subtitle="Please enter the verification code sent to your email to access the document request"
        />

        {/* OTP Verification Card */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-3 sm:p-6">
            {/* Email Display */}
            <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon iconName="mail" size="small" variant="light" />
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Verification Code Sent To
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {recipientEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setError(null);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className={`w-full text-center text-2xl font-mono tracking-widest border rounded-lg px-4 py-2.5 transition-colors ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  } focus:outline-none`}
                />
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                <p className="mt-2 text-xs text-gray-500">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <Icon
                      iconName="alert-circle"
                      size="small"
                      variant="error"
                    />
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {otpSent && !error && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <Icon
                      iconName="check-circle"
                      size="small"
                      variant="success"
                    />
                    Verification code sent successfully!
                  </p>
                </div>
              )}

              {/* Verify Button */}
              <Button
                label={isLoading ? "Verifying..." : "Verify & Continue"}
                variant="brand"
                iconName={isLoading ? undefined : "check"}
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                fullWidth={true}
                size="large"
              />

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={isSending || countdown > 0}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending
                    ? "Sending..."
                    : countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Resend Verification Code"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your verification code expires in 5 minutes
          </p>
        </div>
      </main>
    </div>
  );
}
