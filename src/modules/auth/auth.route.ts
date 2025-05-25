import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import requestValidator from "../../middleware/request-validator";
import { userRegistrationValidationSchema } from "./auth.validation";

const router = Router();

router.post(
    "/register-user",
    requestValidator(userRegistrationValidationSchema),
    AuthControllers.createUser,
);

export const AuthRoutes = router;
