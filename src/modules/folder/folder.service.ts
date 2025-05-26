import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Folder } from "./folder.model";
import { ICreateFolderResponse } from "./folder.interface";
import { Types } from "mongoose";
import { formatBytes } from "../assets/assets.utils";
import { create } from "domain";

const createFolder = async (
    userId: string,
    folderName: string,
    parentId: string | null,
): Promise<ICreateFolderResponse> => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }

    const cleanName = folderName.trim();

    // Optional: Check for duplicate folder name in the same parent
    const existing = await Folder.findOne({
        userId: user._id,
        name: cleanName,
        parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "A folder with this name already exists");
    }

    const folder = new Folder({
        userId: user._id,
        name: folderName,
        parentId: parentId ? new Types.ObjectId(parentId) : null,
    });

    await folder.save();
    return {
        folderId: folder._id,
        name: folder.name,
        size: formatBytes(folder.size),
    };
};

const previewFolder = async (userId: string, folderId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Folder not found");
    }

    if (folder.userId.toString() !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You do not have permission to preview this folder",
        );
    }

    // populate all assets

    await Folder.findById(folderId).populate("assets");

    // get child folders

    const childFolders = await Folder.find({ parentId: folderId }).select(
        "_id size name parentId createdAt",
    );

    return {
        folderId: folder._id,
        name: folder.name,
        parentId: folder.parentId,
        size: folder.size,
        assets: folder.assets,
        childFolders,
    };
};

const retrieveAllRootFolders = async (
    userId: string,
): Promise<
    {
        folderId: Types.ObjectId;
        name: string;
        size: string;
        createdAt: Date | undefined;
    }[]
> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or unknown user");
    }

    const rootFolders = await Folder.find({ userId: user._id, parentId: null });

    if (!rootFolders || rootFolders.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No root folders found");
    }

    const returnData = rootFolders.map((folder) => ({
        folderId: folder._id,
        name: folder.name,
        size: formatBytes(folder.size),
        createdAt: folder.createdAt,
    }));

    return returnData;
};

export const folderService = {
    createFolder,
    previewFolder,
    retrieveAllRootFolders,
};
