import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { folderService } from "./folder.service";
import httpStatus from "http-status";

const createFolder = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { name, parentId } = req.body;

    const result = await folderService.createFolder(userId, name, parentId);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create folder");
    }

    res.status(httpStatus.CREATED).json(
        new ApiResponse({
            statusCode: httpStatus.CREATED,
            message: "Folder created successfully",
            data: result,
        }),
    );
});

export const FolderControllers = {
    createFolder,
};
