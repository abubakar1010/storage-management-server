import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { changePasswordValidationSchema, changeUsernameValidationSchema } from "./user.validation";

const router = Router();

// change password routes

router.post(
    "/change-password",
    auth,
    requestValidator(changePasswordValidationSchema),
    UserControllers.changePassword,
);

// change username

router.post(
    "/change-username",
    auth,
    requestValidator(changeUsernameValidationSchema),
    UserControllers.changeUsername,
);
export const UserRoutes = router;
