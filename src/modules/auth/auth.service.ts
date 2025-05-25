import { config } from "../../config";
import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import { IUserLogin, IUserRegistration } from "./auth.interface";
import httpStatus from "http-status";
import { GenerateToken } from "./auth.utils";
import { SignOptions } from "jsonwebtoken";
import { GenerateOTP, otpEmailTemplate } from "../otpToken/otpToken.utils";
import { sendEmail } from "../../utils/SendEmail";
import { OTPToken } from "../otpToken/otpToken.model";
import bcrypt from "bcrypt";

const registerUserIntoDB = async (
    userData: IUserRegistration,
): Promise<Omit<IUserRegistration, "password">> => {
    // checking if the user is exist
    const user = await User.findOne({
        email: userData?.email,
    });

    // if user exist then throw error
    if (user) {
        throw new ApiError(httpStatus.CONFLICT, "User already exist with this email!");
    }

    // create user

    const newUser = new User(userData);

    newUser.storage.totalStorage = 15 * 1000; // 15 MB

    newUser.storage.availableStorage = 15 * 1000; // 15 MB

    await newUser.save();

    const data = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
    };
    return data;
};

const loginUser = async (
    userData: IUserLogin,
): Promise<Omit<IUserRegistration, "password"> & { token: string }> => {
    // checking if the user is exist
    const user = await User.findOne({ email: userData?.email });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");
    }

    if (user?.isDeleted) {
        throw new ApiError(httpStatus.NOT_FOUND, "This Account is already deleted");
    }

    const validPassword = await User.isPasswordMatched(userData?.password, user?.password);

    if (!validPassword) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials");

    const payload = {
        _id: user._id.toString(),
    };

    const token = GenerateToken(
        payload,
        config.jwt_access_secret!,
        config.jwtExpiry! as SignOptions["expiresIn"],
    );

    if (!token) {
        throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
    }

    const data = {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
    };

    return data;
};

const forgotPassword = async (email: string): Promise<{ message: string }> => {
    // checking if the user is exist
    const user = await User.findOne({ email });

    // if user does not exist then throw error

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found with this email!");
    }

    const otp = GenerateOTP();

    if (!otp) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to generate OTP");
    }

    // create OTP token document

    // data

    const newOtp = {
        userId: user._id,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    };

    const otpToken = await OTPToken.create(newOtp);

    if (!otpToken) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create new OTP entry");
    }

    // Send OTP to user's email

    const info = await sendEmail(email, "Your OTP Code", otpEmailTemplate(otp, user.username));

    // console.log("info", info);

    if (!info || !info.response.includes("OK")) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP email");
    }

    return {
        message: "OTP sent to your email successfully",
    };
};

const verifyOTP = async (userId: string, otp: string): Promise<{ message: string }> => {
    // Find the OTP token for the user
    const otpToken = await OTPToken.findOne({ userId });

    if (!otpToken) {
        throw new ApiError(httpStatus.NOT_FOUND, "Invalid or expired OTP");
    }

    // Check if the OTP is expired
    if (otpToken.expiresAt < new Date()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "OTP has expired");
    }

    // Check if the OTP matches

    const isOTPValid = await bcrypt.compare(otp, otpToken.otp);

    if (!isOTPValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid OTP");
    }

    // If valid, delete the OTP token
    await OTPToken.deleteOne({ _id: otpToken._id });

    return { message: "OTP verified successfully" };
}

export const authService = {
    registerUserIntoDB,
    loginUser,
    forgotPassword,
    verifyOTP,
};
