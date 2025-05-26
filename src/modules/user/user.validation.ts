import { z } from "zod";

export const changePasswordValidationSchema = z
    .object({
        currentPassword: z.string().min(6, "Current password must be at least 6 characters long"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                "New password must contain uppercase, lowercase, number, and symbol",
            ),
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "new password and confirm new password must match",
        path: ["confirmNewPassword"],
    });
