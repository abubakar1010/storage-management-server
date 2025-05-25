import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import {
    forgotPasswordValidationSchema,
    optVerificationValidationSchema,
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
    auth,
    requestValidator(optVerificationValidationSchema),
    AuthControllers.verifyOTP,
);

export const AuthRoutes = router;
