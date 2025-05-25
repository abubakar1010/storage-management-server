import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import {
    changePasswordValidationSchema,
    forgotPasswordValidationSchema,
    optVerificationValidationSchema,
    resetPasswordValidationSchema,
    userLoginValidationSchema,
    userRegistrationValidationSchema,
} from "./auth.validation";
import auth from "../../middleware/auth";

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

// change password routes

router.post(
    "/change-password",
    auth,
    requestValidator(changePasswordValidationSchema),
    AuthControllers.changePassword,
);

export const AuthRoutes = router;
