import z from "zod";

export const postFormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "Content is required.",
    })
    .max(200, { message: "Content cannot exceed 200 characters." }),
});
