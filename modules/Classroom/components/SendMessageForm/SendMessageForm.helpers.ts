import { z } from "zod";

export const SendMessageFormSchema = z
  .object({
    content: z.string().min(1, "You need to input a message in the text box"),
    file: z
      .instanceof(File)
      .refine(
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
      )
      .optional(),
  })
  .strict();

export type SendMessageFormValues = z.infer<typeof SendMessageFormSchema>;
