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

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "OTP sent successfully to your email",
            data: null,
        }),
    );
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const {_id} = req.user; 

    const result = await authService.verifyOTP(_id, otp);

    if (!result) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to verify OTP");
    }

    res.status(httpStatus.OK).json(
        new ApiResponse({
            statusCode: httpStatus.OK,
            message: "OTP verified successfully",
            data: null,
        }),
    );
});

export const AuthControllers = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOTP
};
