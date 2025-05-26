import { Router } from "express";
import { FolderControllers } from "./folder.controllers";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { createFolderValidationSchema } from "./folder.validaton";

const router = Router();

// create folder route

router.post(
    "/create-folder",
    auth,
    requestValidator(createFolderValidationSchema),
    FolderControllers.createFolder,
);

// preview folder route

router.get(
    "/preview-folder/:folderId",
    auth,
    FolderControllers.previewFolder,
);

// retrieve all root folders route

router.get(
    "/retrieve-all-root-folders",
    auth,
    FolderControllers.retrieveAllRootFolders,
);

export const FolderRoutes = router;
