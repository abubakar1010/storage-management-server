import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { Folder } from "./folder.model";
import { ICreateFolderResponse } from "./folder.interface";
import { Types } from "mongoose";

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
    };
};

export const folderService = {
    createFolder,
};
