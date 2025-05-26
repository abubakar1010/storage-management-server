import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { IGenericResponse, IUploadAsset, IUploadedAssetResponse } from "./assets.interface";
import { uploadAssets } from "../../utils/UploadAssets";
import { Asset } from "./assets.model";
import { formatBytes } from "./assets.utils";

const insertAsset = async (uploadData: IUploadAsset): Promise<IUploadedAssetResponse> => {
    const { userId, fileName, filePath, category } = uploadData;
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }

    // check if the asset already exist

    const existing = await Asset.findOne({ userId, title: fileName, category });

    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "A file with this name already exists");
    }

    const cloudinaryResponse = await uploadAssets(fileName, filePath);

    if (!cloudinaryResponse) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload asset");
    }

    // check user has enough storage

    if (user.storage.availableStorage < cloudinaryResponse.bytes) {
        throw new ApiError(httpStatus.FORBIDDEN, "Not enough storage available");
    }

    // Create the asset object

    const asset = {
        userId: user._id,
        category: category,
        title: fileName,
        size: cloudinaryResponse.bytes,
        url: cloudinaryResponse.secure_url,
    };

    // Save the asset to the user's assets array

    const newAsset = new Asset(asset);

    await newAsset.save();

    // Update the user's storage information
    user.storage.usagesStorage += newAsset.size;
    user.storage.availableStorage -= newAsset.size;

    await user.save();

    return {
        assetId: newAsset._id,
        title: newAsset.title,
        category: newAsset.category,
        url: newAsset.url,
        size: formatBytes(newAsset.size),
        createdAt: newAsset.createdAt,
    };
};

const deleteAsset = async (userId: string, assetId: string): Promise<IGenericResponse> => {
    // check if user exist
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    // check if asset exist
    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown asset");
    }
    // check if asset belongs to user
    if (asset.userId.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to delete this asset");
    }

    // implement transaction to delete asset and update user storage

    const session = await User.startSession();
    session.startTransaction();
    try {
        // Delete the asset
        await Asset.deleteOne({ _id: assetId });

        // Update user's storage
        user.storage.usagesStorage -= asset.size;
        user.storage.availableStorage += asset.size;

        await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete asset");
    } finally {
        session.endSession();
    }

    return {
        message: "Asset deleted successfully",
        success: true,
    };
};

const addToFavorite = async (userId: string, assetId: string): Promise<IUploadedAssetResponse> => {
    // check if user exist

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    // check if asset exist
    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown asset");
    }

    // Add asset to user's favorites
    await User.updateOne({ _id: userId }, { $addToSet: { favorite: assetId } });

    return {
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    };
};

export const assetService = {
    insertAsset,
    addToFavorite,
    deleteAsset,
};
