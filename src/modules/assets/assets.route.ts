import { Router } from "express";
import { AssetControllers } from "./assets.controller";
import auth from "../../middleware/auth";
import { upload } from "../../utils/UploadAssets";

const router = Router();

// upload notes

router.post(
    "/upload-assets",
    upload.single("asset"),
    auth,
    AssetControllers.insertAsset,
);
export const AssetRoute = router;
