import {
  DocumentRequest,
  RequestDetails,
  InputDocument,
  DataPolicy,
  Audit,
} from "../types";

export const createEmptyRequestDetails = (): RequestDetails => ({
  id: "",
  title: "",
  recipientName: "",
  email: "",
  recipients: [{ name: "", email: "" }],
  createdAt: undefined,
  createdBy: "",
  status: "",
  purpose: "",
  expires: "",
});

export const createEmptyInputDocument = (): InputDocument => ({
  type: "",
  icon: "",
  required: false,
  label: "",
  description: "",
  colourVariant: "blue",
});

export const createEmptyDataPolicy = (): DataPolicy => ({
  encrypt: false,
  autoDeletePeriod: "",
  auditTrail: false,
});

export const createEmptyAudit = (): Audit => ({
  created: null,
  viewed: null,
  submitted: null,
});

export const createEmptyRequestData = (): DocumentRequest => ({
  id: null,
  requestedCategories: [],
  requestDetails: createEmptyRequestDetails(),
  dataPolicy: createEmptyDataPolicy(),
  audit: createEmptyAudit(),
});
