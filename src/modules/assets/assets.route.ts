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

// preview all assets by category

router.get("/preview-assets/:category", auth, AssetControllers.previewAllAssetByCategory);

// preview favorite assets

router.get("/preview-favorite-assets", auth, AssetControllers.previewFavoriteAssets);

// remove asset from favorite

router.delete("/remove-favorite-asset/:assetId", auth, AssetControllers.removeAssetFromFavorite);

// find asset by date

router.get("/find-asset-by-date/:date", auth, AssetControllers.findAssetByDate);

export const AssetRoute = router;
