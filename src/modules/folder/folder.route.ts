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

export const FolderRoutes = router;
