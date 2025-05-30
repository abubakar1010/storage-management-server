import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { IAsset, IAssetResponse, IGenericResponse, IUploadAsset } from "./assets.interface";
import { uploadAssets } from "../../utils/UploadAssets";
import { Asset } from "./assets.model";
import { formatBytes, sanitizeFileName } from "./assets.utils";
import { Folder } from "../folder/folder.model";
import { Types } from "mongoose";

const insertAsset = async (uploadData: IUploadAsset): Promise<IAssetResponse> => {
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
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");

    const asset = await Asset.findById(assetId);
    if (!asset) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown asset");

    if (asset.userId.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to delete this asset");
    }

    const session = await User.startSession();

    try {
        await session.withTransaction(async () => {
            // Delete asset inside transaction
            await Asset.deleteOne({ _id: assetId }, { session });

            // Update user storage safely
            user.storage.usagesStorage = Math.max(0, user.storage.usagesStorage - asset.size);
            user.storage.availableStorage = Math.max(0, user.storage.availableStorage + asset.size);

            await user.save({ session });

            // Remove asset from favorite and private arrays in all users
            await User.updateMany(
                { favorite: assetId },
                { $pull: { favorite: assetId } },
                { session },
            );
            await User.updateMany(
                { private: assetId },
                { $pull: { private: assetId } },
                { session },
            );

            // Remove asset from all folders
            await Folder.updateMany(
                { assets: assetId },
                { $pull: { assets: assetId } },
                { session },
            );
        });

        session.endSession();

        return {
            message: "Asset deleted successfully",
            success: true,
        };
    } catch{
        await session.abortTransaction();
        session.endSession();

        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete asset");
    }
};

const renameAsset = async (
    userId: string,
    assetId: string,
    newTitle: string,
): Promise<IAssetResponse> => {
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
        throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to rename this asset");
    }
    // check if new title is already used by the user
    const isTitleUsed = await Asset.findOne({ userId, title: newTitle });
    if (isTitleUsed) {
        throw new ApiError(httpStatus.CONFLICT, "Title is already in use");
    }

    // sanitize new title
    const sanitizedTitle = sanitizeFileName(newTitle, asset.title);

    // update asset title
    asset.title = sanitizedTitle;
    await asset.save();

    return {
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    };
};

const previewAllAssetByCategory = async (
    userId: string,
    category: string,
): Promise<IAssetResponse[]> => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    const assets = await Asset.find({ userId: user._id, category });

    if (assets.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, `No ${category} assets found`);
    }

    return assets.map((asset) => ({
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    }));
};

const addToFavorite = async (userId: string, assetId: string): Promise<IAssetResponse> => {
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

    // check asset already exists in user's favorites

    if (user.favorite.some((favId) => favId.toString() === assetId)) {
        throw new ApiError(httpStatus.CONFLICT, "Asset is already in your favorites");
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

const previewFavoriteAssets = async (userId: string): Promise<IAssetResponse[]> => {
    const user = await User.findById(userId).populate("favorite");

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    if (user.favorite.length <= 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "You haven't any asset as favorite");
    }

    const assets = user.favorite as unknown as IAsset[];

    return assets.map((asset) => ({
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    }));
};

const removeAssetFromFavorite = async (
    userId: string,
    assetId: string,
): Promise<IGenericResponse> => {
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

    // check if asset is in user's favorites
    if (!user.favorite.some((favId) => favId.toString() === assetId)) {
        throw new ApiError(httpStatus.NOT_FOUND, "Asset is not in your favorites");
    }

    // Remove asset from user's favorites
    await User.findByIdAndUpdate(userId, { $pull: { favorite: new Types.ObjectId(assetId) } });

    return {
        message: "Asset removed from favorites successfully",
        success: true,
    };
};

const findAssetByDate = async (userId: string, targetDate: Date): Promise<IAssetResponse[]> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    // Clone the date to avoid mutation issues
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const assets = await Asset.find({
        userId: user._id,
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });

    if (assets.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No assets found for the specified date");
    }

    return assets.map((asset) => ({
        assetId: asset._id,
        title: asset.title,
        category: asset.category,
        url: asset.url,
        size: formatBytes(asset.size),
        createdAt: asset.createdAt,
    }));
};

export const assetService = {
    insertAsset,
    addToFavorite,
    deleteAsset,
    renameAsset,
    previewAllAssetByCategory,
    previewFavoriteAssets,
    removeAssetFromFavorite,
    findAssetByDate,
};
