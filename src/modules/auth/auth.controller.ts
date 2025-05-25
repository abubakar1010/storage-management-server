import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const createUser = asyncHandler(async (req, res) => {
    const userData = req.body;

    const result = await authService.registerUserIntoDB(userData);

    // if user is not created then throw error
    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User registration failed");
    }

    res.status(httpStatus.CREATED).json(
        new ApiResponse({
            statusCode: httpStatus.CREATED,
            message: "User is created successfully",
            data: result,
        }),
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User login failed");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "User is logged in successfully!",
            data: result,
        }),
    );
});

export const AuthControllers = {
    createUser,
    loginUser,
};
