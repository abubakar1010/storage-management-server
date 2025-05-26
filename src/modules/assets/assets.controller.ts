import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { assetService } from "./assets.service";

const insertAsset = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    let formData;
    try {
        formData = JSON.parse(req.body.formData);
    } catch {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid form data");
    }

    // check if formData has valid category

    const { category } = formData;

    const allowedCategories = ["notes", "images", "pdfs"];
    if (!allowedCategories.includes(category)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
    }

    if (!req.file || !req.file.path || !req.file.originalname) {
        throw new ApiError(httpStatus.BAD_REQUEST, "File is required");
    }

     const sanitizedFileName = req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const uploadData = {
        userId: _id,
        fileName: sanitizedFileName,
        filePath: req.file?.path,
        category: category,
    };

    const result = await assetService.insertAsset(uploadData);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload asset");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset uploaded successfully",
            data: result,
        }),
    );
});

export const AssetControllers = {
    insertAsset,
};
