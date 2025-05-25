import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import { userLoginValidationSchema, userRegistrationValidationSchema } from "./auth.validation";

const router = Router();

// User registration routes

router.post(
    "/register-user",
    requestValidator(userRegistrationValidationSchema),
    AuthControllers.createUser,
);

// User login routes

router.post("/login-user", requestValidator(userLoginValidationSchema), AuthControllers.loginUser);

export const AuthRoutes = router;
