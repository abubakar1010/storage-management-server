import httpStatus from "http-status";
import asyncHandler from "../../utils/asyncHandler";
import { userService } from "./user.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;

    const result = await userService.changePassword(_id, currentPassword, newPassword);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to change password");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Password changed successfully",
            data: null,
        }),
    );
});

const changeUsername = asyncHandler(async (req, res) => {
    const { currentUsername, newUsername } = req.body;

    const result = await userService.changeUsername(currentUsername, newUsername);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to change username");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "username changed successfully",
            data: result,
        }),
    );
});

const storageOverview = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const result = await userService.storageOverview(_id);

    if (!result) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to retrieved storage overview ",
        );
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "storage overviews retrieved successfully",
            data: result,
        }),
    );
});

const retrieveRecentAssets = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { limit = 5 } = req.query;

    // Validate limit to be a number

    if (isNaN(Number(limit)) || Number(limit) <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid limit parameter");
    }

    const result = await userService.retrieveRecentAssets(_id, Number(limit));

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve recent assets");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Recent assets retrieved successfully",
            data: result,
        }),
    );
});

// Set secret key for store private assets

const setSecretKey = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { secretKey } = req.body;

    const result = await userService.setSecretKey(_id, secretKey);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to set secret key");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: result.message || "Secret key set successfully",
            data: null,
        }),
    );
});

const addAssetToPrivate = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId, secretKey } = req.body;

    const result = await userService.addAssetToPrivate(_id, assetId, secretKey);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add asset to private");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset added to private successfully",
            data: result,
        }),
    );
});

const previewPrivateAssets = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { secretKey } = req.body;

    const assets = await userService.previewPrivateAssets(_id, secretKey);

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Private Assets retrieved successfully",
            data: assets,
        }),
    );
});

const removeAssetFromPrivate = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { assetId, secretKey } = req.body;

    const result = await userService.removeAssetFromPrivate(_id, assetId, secretKey);

    if (!result) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to remove asset from privates",
        );
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "Asset removed from privates successfully",
            data: null,
        }),
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const result = await userService.deleteUser(_id);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete user");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "User deleted successfully",
            data: result,
        }),
    );
});

export const UserControllers = {
    changePassword,
    changeUsername,
    storageOverview,
    retrieveRecentAssets,
    setSecretKey,
    addAssetToPrivate,
    previewPrivateAssets,
    removeAssetFromPrivate,
    deleteUser,
};
