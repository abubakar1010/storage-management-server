import { config } from "../../config";
import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import { IUserLogin, IUserRegistration } from "./auth.interface";
import httpStatus from "http-status";
import { GenerateToken } from "./auth.utils";
import { SignOptions } from "jsonwebtoken";

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

export const authService = {
    registerUserIntoDB,
    loginUser,
};
