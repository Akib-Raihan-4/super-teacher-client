import { z } from "zod";

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

export const assignmentSubmissionSchema = z.object({
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

export type TAssignmentSubmissionValues = z.infer<typeof assignmentSubmissionSchema>;
