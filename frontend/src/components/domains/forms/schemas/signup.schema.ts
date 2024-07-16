import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().min(5).max(50),
    password: z.string().min(8).max(50),
    passwordConfirm: z.string().min(8).max(50),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["passwordConfirm"],
      });
    }
  });
