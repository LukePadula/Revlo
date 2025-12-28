"use client";

import { useEffect, useState } from "react";
import { useRequestStore } from "@/store/requestStore";
import RequestLink from "@/components/requestLink/page";
import { DocumentRequest } from "../../types";
import DocumentSpinner from "@/components/ui/core/Spinner";
import OtpVerification from "@/components/ui/request/OtpVerification";

interface Props {
  initialRecord: DocumentRequest;
  requestId: string;
}

export default function RequestClientWrapper({
  initialRecord,
  requestId,
}: Props) {
  const setRequestData = useRequestStore((s) => s.setRequestData);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRequestData(initialRecord);

    // Check if OTP is already verified in sessionStorage
    const verifiedKey = `otp_verified_${requestId}`;
    const verified = sessionStorage.getItem(verifiedKey);
    if (verified === "true") {
      setIsOtpVerified(true);
    }
    setIsLoading(false);
  }, [initialRecord, requestId, setRequestData]);

  const requestData = useRequestStore((s) => s.requestData);

  const handleOtpVerified = () => {
    const verifiedKey = `otp_verified_${requestId}`;
    sessionStorage.setItem(verifiedKey, "true");
    setIsOtpVerified(true);
  };

  if (isLoading || !requestData) {
    return <DocumentSpinner />;
  }

  // Show OTP verification if not verified
  if (!isOtpVerified) {
    return (
      <OtpVerification
        requestId={requestId}
        requestDetails={requestData.requestDetails}
        onVerified={handleOtpVerified}
      />
    );
  }

  // Show document upload after OTP verification
  return <RequestLink record={requestData} />;
}
