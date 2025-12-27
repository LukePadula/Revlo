import * as z from "zod";

// Schema for validating RequestDetails
export const requestDetailsSchema = z
  .object({
    title: z
      .string()
      .min(1, "Request title is required")
      .refine((val) => val.trim().length > 0, "Request title cannot be empty"),
    recipientName: z.string().optional(), // Optional for backward compatibility
    email: z.string().optional(), // Optional for backward compatibility
    purpose: z
      .string()
      .min(1, "Purpose is required")
      .refine((val) => val.trim().length > 0, "Purpose cannot be empty"),
    recipients: z
      .array(
        z.object({
          name: z
            .string()
            .min(1, "Recipient name is required")
            .refine((val) => val.trim().length > 0, "Recipient name cannot be empty"),
          email: z
            .string()
            .email("Please enter a valid email address")
            .refine((val) => val.trim().length > 0, "Email cannot be empty"),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Check if recipients array exists and has valid entries
      if (data.recipients && Array.isArray(data.recipients) && data.recipients.length > 0) {
        // Filter out empty recipients and validate remaining ones
        const validRecipients = data.recipients.filter(
          (r) =>
            r &&
            r.name &&
            typeof r.name === "string" &&
            r.name.trim().length > 0 &&
            r.email &&
            typeof r.email === "string" &&
            r.email.trim().length > 0
        );
        
        // All valid recipients must have valid emails
        const allEmailsValid = validRecipients.every((r) =>
          z.string().email().safeParse(r.email).success
        );
        
        return validRecipients.length > 0 && allEmailsValid;
      }
      
      // Fallback to legacy fields
      if (data.recipientName && data.email) {
        const nameValid =
          typeof data.recipientName === "string" &&
          data.recipientName.trim().length > 0;
        const emailValid =
          typeof data.email === "string" &&
          data.email.trim().length > 0 &&
          z.string().email().safeParse(data.email).success;
        return nameValid && emailValid;
      }
      
      return false;
    },
    {
      message: "At least one recipient with name and valid email is required",
      path: ["recipients"],
    }
  );

export const categorySchema = z.object({
  description: z.string().min(1, "Category description is required"),
  selected: z.boolean().optional(),
  requestedDocumentList: z.array(z.any()).optional(), // replace z.any() later with the actual doc schema
});

export const categoryListSchema = z.record(categorySchema);

export const documentRequestSchema = z.object({
  requestDetails: requestDetailsSchema,
  categories: z
    .array(categorySchema)
    .min(1, "At least one document must be added"),
});
