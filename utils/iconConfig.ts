import { IconConfig } from "@/types";

export default function iconMap(id: typeof iconMap) {
  const iconMap = {
    passport: { name: "globe", colour: "blue" },
    national_id: { name: "id-card", colour: "green" },
    drivers_license: { name: "car-front", colour: "blue" },
    visa_immigration_document: { name: "tickets-plane", colour: "blue" },
    utility_bill: { name: "zap", colour: "blue" },
    tenancy_agreement: { name: "building", colour: "blue" },
    mortgage_statement: { name: "house", colour: "blue" },
    bank_statement: { name: "landmark", colour: "blue" },
    payslip: { name: "badge-pound-sterling", colour: "blue" },
    credit_report: { name: "banknote-arrow-up", colour: "blue" },
    degree_certificate: { name: "graduation-cap", colour: "blue" },
    transcript: { name: "book-type", colour: "blue" },
    qualification_certificate: { name: "school", colour: "blue" },
  };

  return iconMap[id];
}
