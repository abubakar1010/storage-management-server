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

export const changeUsernameValidationSchema = z
    .object({
        currentUsername: z.string().trim().min(3, "Username must be at least 3 characters long"),
        newUsername: z.string().trim().min(3, "Username must be at least 3 characters long"),
        confirmNewUsername: z.string().trim().min(3, "Username must be at least 3 characters long"),
    })
    .refine((data) => data.newUsername === data.confirmNewUsername, {
        message: "new username and confirm new username must match",
        path: ["confirmNewUsername"],
    });

export const setSecretKeyValidationSchema = z.object({
    secretKey: z
        .string()
        .trim()
        .min(6, "Secret key must be at least 6 characters long")
        .max(64, "Secret key must not exceed 64 characters"),
});

export const addToPrivateValidationSchema = z.object({
    secretKey: z
        .string()
        .trim()
        .min(6, "Secret key must be at least 6 characters long")
        .max(64, "Secret key must not exceed 64 characters"),
    assetId: z
        .string()
        .nonempty("Asset ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid Asset ID format"),
});
