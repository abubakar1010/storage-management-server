import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import {
    addToPrivateValidationSchema,
    changePasswordValidationSchema,
    changeUsernameValidationSchema,
    setSecretKeyValidationSchema,
} from "./user.validation";

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

// retrieve storage overview route

router.get("/storage-overview", auth, UserControllers.storageOverview);

// retrieve recent assets route

router.get("/recent-assets", auth, UserControllers.retrieveRecentAssets);

// set secret key route

router.post(
    "/set-secret-key",
    auth,
    requestValidator(setSecretKeyValidationSchema),
    UserControllers.setSecretKey,
);

// add asset to private

router.post(
    "/add-to-private",
    auth,
    requestValidator(addToPrivateValidationSchema),
    UserControllers.addAssetToPrivate,
);

// preview private assets

router.get(
    "/preview-private-assets",
    auth,
    requestValidator(setSecretKeyValidationSchema),
    UserControllers.previewPrivateAssets,
);

export const UserRoutes = router;
