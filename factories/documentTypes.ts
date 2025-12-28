import { InputDocument } from "@/types";

export const createPassportDocType = (): InputDocument => ({
  type: "passport",
  icon: "globe",
  required: true,
  label: "Passport",
  description: "upload passport",
  colourVariant: "blue",
});

export const createGovernmentIdDocType = (): InputDocument => ({
  type: "Government ID",
  icon: "globe",
  required: true,
  label: "Government ID",
  description: "Upload government ID",
  colourVariant: "purple",
});

export const createBankStatementDocType = (): InputDocument => ({
  type: "Bank Statement",
  icon: "landmark",
  required: true,
  label: "Bank Statement",
  description: "Upload latest bank statment",
  colourVariant: "green",
});

export const createEducationCertificateDocType = (): InputDocument => ({
  type: "Education Certificate",
  icon: "graduation-cap",
  required: true,
  label: "Education Certificate",
  description: "Upload certificate",
  colourVariant: "orange",
});
