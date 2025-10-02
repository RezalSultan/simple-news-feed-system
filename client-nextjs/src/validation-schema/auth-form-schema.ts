import z from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const registerFormSchema = z
  .object({
    username: z.string().min(1, {
      message: "Username is required",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirm_password: z.string().min(6, {
      message: "Confirm password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
