import { Router } from "express";
import { AssetControllers } from "./assets.controller";
import auth from "../../middleware/auth";
import { upload } from "../../utils/UploadAssets";
import requestValidator from "../../middleware/request-validator";
import { addToFavoriteValidationSchema } from "./assets.validation";

const router = Router();

// upload assets

router.post("/upload-assets", upload.single("asset"), auth, AssetControllers.insertAsset);

// add asset to favorite

router.post(
    "/add-to-favorite",
    auth,
    requestValidator(addToFavoriteValidationSchema),
    AssetControllers.addToFavorite,
);

export const AssetRoute = router;
