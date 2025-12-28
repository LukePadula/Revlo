import * as z from "zod";
import { DocumentRequest, ErrorMap } from "@/types";
import { requestDetailsSchema, categorySchema, categoryListSchema } from "./requestSchemas";

function getErrorMapFromZod(error: z.ZodError): ErrorMap {
  const err: ErrorMap = {};

  for (const issue of error.issues) {
    if (issue.path.length > 0) {
      const last = issue.path[issue.path.length - 1];

      if (typeof last === "string" || typeof last === "number") {
        err[String(last)] = issue.message;
      }
    }
  }

  return err;
}

export function validateRequestDetails(record: DocumentRequest) {
  // Validate the requestDetails object, not the entire DocumentRequest
  if (!record || !record.requestDetails) {
    return {
      isValid: false,
      errors: { root: "Request details are missing" },
    };
  }

  const result = requestDetailsSchema.safeParse(record.requestDetails);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors = getErrorMapFromZod(result.error);
  
  // Log validation errors for debugging (can be removed in production)
  if (process.env.NODE_ENV === "development" && Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    console.log("Request details being validated:", JSON.stringify(record.requestDetails, null, 2));
  }

  return {
    isValid: false,
    errors,
  };
}

// Helper function to validate just RequestDetails (for direct use)
export function validateRequestDetailsOnly(requestDetails: any) {
  const result = requestDetailsSchema.safeParse(requestDetails);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors: getErrorMapFromZod(result.error),
  };
}

export function validateRequestCategories(record: unknown) {
  const result = categoryListSchema.safeParse(record);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors: getErrorMapFromZod(result.error),
  };
}
