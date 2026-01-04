"use server";

import { ContactSubmission, ContactSubmissionSchema } from "@/lib/types";
import { saveContactSubmission } from "@/lib/db-adapter";

export async function submitContactAction(
  data: Omit<ContactSubmission, "id" | "submittedAt">
) {
  const submission: ContactSubmission = {
    ...data,
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
  };

  const validated = ContactSubmissionSchema.parse(submission);
  await saveContactSubmission(validated);
  return validated;
}
