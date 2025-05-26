import { Router } from "express";
import { AssetControllers } from "./assets.controller";
import auth from "../../middleware/auth";
import { upload } from "../../utils/UploadAssets";
import requestValidator from "../../middleware/request-validator";
import { assetActionValidationSchema, renameAssetValidationSchema } from "./assets.validation";

const router = Router();

// upload assets

router.post("/upload-assets", upload.single("asset"), auth, AssetControllers.insertAsset);

// delete asset

router.delete(
    "/delete-asset",
    auth,
    requestValidator(assetActionValidationSchema),
    AssetControllers.deleteAsset,
);

// add asset to favorite

router.post(
    "/add-to-favorite",
    auth,
    requestValidator(assetActionValidationSchema),
    AssetControllers.addToFavorite,
);

// rename asset

router.patch(
    "/rename-asset",
    auth,
    requestValidator(renameAssetValidationSchema),
    AssetControllers.renameAsset,
);

export const AssetRoute = router;
