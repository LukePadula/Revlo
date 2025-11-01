export type ColourVariant = "blue" | "purple" | "green" | "orange";

export interface InputDocument {
  type: string;
  icon: string;
  required: boolean;
  label: string;
  description: string;
  colourVariant: ColourVariant;
}

export interface RequestDetails {
  status: string;
  requestedBy: string;
  purpose: string;
  expires: string;
}

export interface DataPolicy {
  encrypt: boolean;
  autoDeletePeriod: string;
  auditTrail: boolean;
}

export interface Audit {
  created: string;
  viewed: string;
  submitted: string;
}

export interface RequestData {
  input: InputDocument[];
  requestDetails: RequestDetails;
  dataPolicy: DataPolicy;
  audit: Audit;
}
