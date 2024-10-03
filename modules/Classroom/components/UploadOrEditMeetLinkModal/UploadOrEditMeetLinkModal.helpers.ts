import { z } from "zod";

export const meetlinkSchema = z.object({
  meetlink: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => {
        const googleMeetPattern =
          /^https:\/\/meet\.google\.com\/[a-z0-9]{3,4}-[a-z0-9]{3,4}-[a-z0-9]{3,4}$/;
        return googleMeetPattern.test(url);
      },
      {
        message: "Please enter a valid Google Meet link",
      },
    ),
});

export type TMeetlinkFormValues = z.infer<typeof meetlinkSchema>;
