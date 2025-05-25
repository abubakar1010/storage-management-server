import { z } from "zod";

export const userRegistrationValidationSchema = z
    .object({
        username: z.string().trim().min(3, "Username must be at least 3 characters long"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                "Password must contain uppercase, lowercase, number, and symbol",
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "password and confirm password must match",
        path: ["confirmPassword"],
    });

export const userLoginValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const optVerificationValidationSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 characters long"),
    email: z.string().email("Invalid email address"),
});

export const resetPasswordValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "Password must contain uppercase, lowercase, number, and symbol",
        ),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "new password and confirm new password must match",
    path: ["confirmNewPassword"],
});
