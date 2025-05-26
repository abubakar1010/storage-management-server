import ApiError from "../../utils/ApiError";
import { IUploadedAssetResponse } from "../assets/assets.interface";
import { Asset } from "../assets/assets.model";
import { formatBytes } from "../assets/assets.utils";
import { IPasswordOperationResponse } from "../auth/auth.interface";
import { IStorageOverviewResponse } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string,
): Promise<IPasswordOperationResponse> => {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await User.isPasswordMatched(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
};

const changeUsername = async (
    currentUsername: string,
    newUsername: string,
): Promise<{ username: string }> => {
    const user = await User.findOne({ username: currentUsername });

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid username");
    }

    user.username = newUsername;

    await user.save();

    return {
        username: user.username,
    };
};

const storageOverview = async (userId: string): Promise<IStorageOverviewResponse> => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }

    const assets = await Asset.aggregate([
        { $match: { userId: user._id } },
        {
            $group: {
                _id: "$category",
                totalSize: { $sum: "$size" },
                totalItem: { $sum: 1 },
            },
        },
    ]);

    const storage = {
        totalStorage: formatBytes(user.storage.totalStorage),
        usagesStorage: formatBytes(user.storage.usagesStorage),
        availableStorage: formatBytes(user.storage.availableStorage),
    };

    const notes = assets.find((item) => item._id === "notes") || { totalItem: 0, totalSize: 0 };
    const images = assets.find((item) => item._id === "images") || { totalItem: 0, totalSize: 0 };
    const pdfs = assets.find((item) => item._id === "pdfs") || { totalItem: 0, totalSize: 0 };

    return {
        storage,
        // TODO:Work on folder later
        folder: {
            totalItem: 0,
            totalSize: "0 B",
        },
        notes: {
            totalItem: notes.totalItem,
            totalSize: formatBytes(notes.totalSize),
        },
        images: {
            totalItem: images.totalItem,
            totalSize: formatBytes(images.totalSize),
        },
        pdfs: {
            totalItem: pdfs.totalItem,
            totalSize: formatBytes(pdfs.totalSize),
        },
    };
};

const retrieveRecentAssets = async (
    userId: string,
    limit: number,
): Promise<IUploadedAssetResponse[]> => {
    const assets = await Asset.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("title url size category createdAt");

    return assets.map((asset) => ({
        assetId: asset._id,
        title: asset.title,
        url: asset.url,
        size: formatBytes(asset.size),
        category: asset.category,
        createdAt: asset.createdAt,
    }));
};

export const userService = {
    changePassword,
    changeUsername,
    storageOverview,
    retrieveRecentAssets,
};
