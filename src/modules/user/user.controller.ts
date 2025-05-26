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

export const UserControllers = {
    changePassword,
};
