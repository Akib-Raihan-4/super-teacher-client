import { z } from "zod";

export const acceptedFileTypes = {
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

export const materialFormSchema = z.object({
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
});

export const editMaterialFormSchema = materialFormSchema.extend({
  file: z.instanceof(File, { message: "File is optional" }).optional(),
});

export type TMaterialFormValues = z.infer<typeof materialFormSchema>;
export type TMaterialFormValuesEdit = z.infer<typeof editMaterialFormSchema>;
