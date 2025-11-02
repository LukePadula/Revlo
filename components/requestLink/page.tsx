"use client";
import Nav from "../ui/nav";
import PageCard from "../ui/pageCard";
import Icon from "../ui/icon";
import RequestDetailsList from "../ui/requestDetailsList";
import DocumentUploadContainer from "../ui/documentUploadContainer";
import SubmissionConfirmation from "../ui/submissionConfirmation";
import { useEffect } from "react";
import { InputDocument } from "../../types";

import detectCamera from "../../utils/camera";

export default function RequestLink() {
  const data = {
    input: [
      {
        type: "passport",
        icon: "globe",
        required: true,
        label: "Passport",
        description: "A clear photo of your passport",
        colourVariant: "blue",
      },
      {
        type: "bankStatement",
        icon: "landmark",
        required: true,
        label: "Bank Statement",
        description: "Latest Bank Statement",
        colourVariant: "green",
      },
      {
        type: "governmentId",
        icon: "id-card",
        required: true,
        label: "Government ID",
        description: "Drivers licence or national ID",
        colourVariant: "purple",
      },
    ],
    requestDetails: {
      status: "Pending",
      requestedBy: "Luke Padula",
      purpose: "Verify identity",
      expires: "48hr",
    },
    dataPolicy: { encrypt: true, autoDeletePeriod: "7 days", auditTrail: true },
    audit: { created: "dateTime", viewed: "dateTime", submitted: "dateTime" },
  };

  useEffect(() => {
    async function checkCamera() {
      const hasCamera = await detectCamera();
      console.log("Has camera:", hasCamera);
    }

    checkCamera();
  }, []);

  return (
    <>
      <div className="w-full space-y-4 md:space-y-6 flex flex-col items-center">
        <Nav />
        <div className="mx-28 mb-4 space-y-4 md:space-y-6 px-4 max-w-lg md:max-w-3xl xlg:max-w-6xl w-full">
          <PageCard
            icon={<Icon iconName="file-stack" variant="light" size="medium" />}
            title="Document Request"
            headerVariant="neutral"
          >
            <div className="md:flex justify-between">
              <RequestDetailsList
                title="Request Details"
                items={[
                  `Requested by: ${data.requestDetails.requestedBy}`,
                  `Purpose:  ${data.requestDetails.purpose}`,
                  `Expires: ${data.requestDetails.expires}`,
                ]}
              />
              <RequestDetailsList
                title="Data Policy"
                listItemIcon={
                  <Icon iconName="check" variant="success" size="small" />
                }
                items={[
                  "End-to-end encryption enabled",
                  "Automatic deletion after 7 days or upon review completion",
                  "Audit trail maintained",
                ]}
              />
            </div>
          </PageCard>
          <PageCard
            icon={<Icon iconName="file-stack" variant="medium" size="medium" />}
            title="Document Request"
            subtitle="Please upload all required documents below."
            headerVariant="brand"
          >
            <DocumentUploadContainer
              inputDocuments={data.input as InputDocument[]}
              hasCamera={true}
            />
          </PageCard>

          <PageCard>
            <SubmissionConfirmation />
          </PageCard>
        </div>
      </div>
    </>
  );
}
