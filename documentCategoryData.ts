import { Category, DocumentCategoryMap, iconConfigMap } from "./types";

export const categoryTemplateData: DocumentCategoryMap = {
  identity: {
    title: "Identity Documents",
    description: "Proof of identity verification",
    requiredType: "all",
    minimumRequiredDocumentCount: 1,
    selected: false,
    requestedDocumentList: [
      { id: "passport", label: "Passport", selected: false },
      { id: "national_id", label: "National ID", selected: false },
      { id: "drivers_license", label: "Drivers License", selected: false },
      {
        id: "visa_immigration_document",
        label: "Visa / Immigration Document",
        selected: false,
      },
    ],
  },
  address: {
    title: "Proof of Address",
    description: "Residential address verification",
    requiredType: "all",
    minimumRequiredDocumentCount: 1,
    selected: false,
    requestedDocumentList: [
      { id: "utility_bill", label: "Utility Bill", selected: false },
      {
        id: "mortgage_statement",
        label: "Mortgage Statement",
        selected: false,
      },
      {
        id: "tenancy_agreement",
        label: "Tenancy Agreement",
        selected: false,
      },
    ],
  },
  finance: {
    title: "Financial Documents",
    description: "Financial documents and records",
    requiredType: "all",
    minimumRequiredDocumentCount: 1,
    selected: false,
    requestedDocumentList: [
      {
        id: "bank_statement",
        label: "Bank Statement",
        selected: false,
      },
      { id: "payslip", label: "Payslip", selected: false },
      { id: "credit_report", label: "Credit Report", selected: false },
    ],
  },
  // education: {
  //   title: "Education",
  //   description: "Academic credentials",
  //   requiredType: "all",
  //   minimumRequiredDocumentCount: 1,
  //   selected: false,
  //   requestedDocumentList: [
  //     {
  //       id: "degree_certificate",
  //       label: "Degree Certificate",
  //       selected: false,
  //     },
  //     { id: "transcript", label: "Transcript", selected: false },
  //     {
  //       id: "qualification_certificate",
  //       label: "Qualification Certificate",
  //       selected: false,
  //     },
  //   ],
  // },
};

export const iconConfig: iconConfigMap = {
  identity: { name: "id-card", colour: "blue" },
  address: { name: "house", colour: "green" },
  finance: { name: "receipt-pound-sterling", colour: "purple" },
  education: { name: "graduation-cap", colour: "orange" },
};
