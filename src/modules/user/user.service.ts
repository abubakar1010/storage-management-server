import ApiError from "../../utils/ApiError";
import { Asset } from "../assets/assets.model";
import { formatBytes } from "../assets/assets.utils";
import { IPasswordOperationResponse } from "../auth/auth.interface";
import { Folder } from "../folder/folder.model";
import { IStorageOverviewResponse } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { IAsset, IAssetResponse, IGenericResponse } from "../assets/assets.interface";

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

    // folder overview

    const folderStats = await Folder.aggregate([
        { $match: { userId: user._id } },
        {
            $group: {
                _id: null,
                totalSize: { $sum: "$size" },
                totalItem: { $sum: 1 },
            },
        },
    ]);

    const folderOverview = folderStats[0] || { totalSize: 0, totalItem: 0 };

    return {
        storage,

        folder: {
            totalItem: folderOverview.totalItem,
            totalSize: formatBytes(folderOverview.totalSize),
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

const retrieveRecentAssets = async (userId: string, limit: number): Promise<IAssetResponse[]> => {
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

const setSecretKey = async (userId: string, secretKey: string): Promise<IGenericResponse> => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    if (user.secretKey) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Secret key already exists");
    }

    const hashKey = await bcrypt.hash(secretKey, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

    user.secretKey = hashKey;
    await user.save();
    return {
        message: "Secret key set successfully",
        success: true,
    };
};

const addAssetToPrivate = async (
    userId: string,
    assetId: string,
    secretKey: string,
): Promise<IAssetResponse> => {
    // check if user exist

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    const isValidSecretKey = await bcrypt.compare(secretKey, user.secretKey);

    if (!isValidSecretKey) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid secret key");
    }

    // check if asset exist
    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown asset");
    }

    // check asset already exists in user's private assets

    if (user.private.some((favId) => favId.toString() === assetId)) {
        throw new ApiError(httpStatus.CONFLICT, "Asset is already in your private assets");
    }

    // Add asset to user's private assets
    await User.updateOne({ _id: userId }, { $addToSet: { private: assetId } });

    return {
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    };
};

const previewPrivateAssets = async (
    userId: string,
    secretKey: string,
): Promise<IAssetResponse[]> => {
    const user = await User.findById(userId).populate("private");

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    if (user.private.length <= 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "You haven't any asset as private");
    }

    const isValidSecretKey = await bcrypt.compare(secretKey, user.secretKey);

    if (!isValidSecretKey) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid secret key");
    }

    const assets = user.private as unknown as IAsset[];

    return assets.map((asset) => ({
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    }));
};

export const userService = {
    changePassword,
    changeUsername,
    storageOverview,
    retrieveRecentAssets,
    setSecretKey,
    addAssetToPrivate,
    previewPrivateAssets,
};
