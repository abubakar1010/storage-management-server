import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import {
    forgotPasswordValidationSchema,
    optVerificationValidationSchema,
    resetPasswordValidationSchema,
    userLoginValidationSchema,
    userRegistrationValidationSchema,
} from "./auth.validation";

const router = Router();

// User registration routes

router.post(
    "/register-user",
    requestValidator(userRegistrationValidationSchema),
    AuthControllers.createUser,
);

// User login routes

router.post("/login-user", requestValidator(userLoginValidationSchema), AuthControllers.loginUser);

// forgot password routes

router.post(
    "/forgot-password",
    requestValidator(forgotPasswordValidationSchema),
    AuthControllers.forgotPassword,
);

// verify OTP routes

router.post(
    "/verify-otp",
    requestValidator(optVerificationValidationSchema),
    AuthControllers.verifyOTP,
);

// reset password routes

router.post(
    "/reset-password",
    requestValidator(resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;
