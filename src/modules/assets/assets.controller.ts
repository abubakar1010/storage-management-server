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

const deleteAsset = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId } = req.body;

    const result = await assetService.deleteAsset(_id, assetId);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete asset");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset deleted successfully",
            data: result,
        }),
    );
});

const addToFavorite = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId } = req.body;

    const result = await assetService.addToFavorite(_id, assetId);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add asset to favorites");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset added to favorites successfully",
            data: result,
        }),
    );
});

const renameAsset = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId, newTitle } = req.body;

    const result = await assetService.renameAsset(_id, assetId, newTitle);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to rename asset");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset renamed successfully",
            data: result,
        }),
    );
});

const previewAllAssetByCategory = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { category } = req.params;

    const allowedCategories = ["notes", "images", "pdfs"];

    if (!category || !allowedCategories.includes(category)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
    }

    const assets = await assetService.previewAllAssetByCategory(_id, category);

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Assets retrieved successfully",
            data: assets,
        }),
    );
});

const previewFavoriteAssets = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const assets = await assetService.previewFavoriteAssets(_id);

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Favorite Assets retrieved successfully",
            data: assets,
        }),
    );
});

const removeAssetFromFavorite = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId } = req.params;

    if (!assetId || !assetId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid asset ID");
    }

    const result = await assetService.removeAssetFromFavorite(_id, assetId);

    if (!result) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to remove asset from favorites",
        );
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset removed from favorites successfully",
            data: null,
        }),
    );
});

const findAssetByDate = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { date } = req.params;

    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date format. Use YYYY-MM-DD.");
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date provided.");
    }

    const assets = await assetService.findAssetByDate(_id, parsedDate);

    if (!assets || assets.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No assets found for the specified date");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Assets retrieved successfully",
            data: assets,
        }),
    );
});

export const AssetControllers = {
    insertAsset,
    addToFavorite,
    deleteAsset,
    renameAsset,
    previewAllAssetByCategory,
    previewFavoriteAssets,
    removeAssetFromFavorite,
    findAssetByDate,
};
