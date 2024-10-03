import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const acceptedFileTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export const acceptedFileTypesString = Object.entries(acceptedFileTypes)
  .map(([mimeType, extensions]) => `${mimeType},${extensions.join(",")}`)
  .join(",");

export const assignmentFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  file: z.instanceof(File).refine(
    (file) => {
      const acceptedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return acceptedTypes.includes(file.type);
    },
    {
      message: "File must be an image (JPEG, PNG), PDF, or document (DOC, DOCX)",
    },
  ),
  dueDate: z.date({ required_error: "Date is required" }).refine((date) => date >= today, {
    message: "Date cannot be in the past",
  }),
});

export const assignmentFormSchemaEdit = assignmentFormSchema.extend({
  file: z.instanceof(File, { message: "File is optional" }).optional(),
});

export type TAssignmentFormValues = z.infer<typeof assignmentFormSchema>;
export type TAssignmentFormValuesEdit = z.infer<typeof assignmentFormSchemaEdit>;
