import ApiError from "../../utils/ApiError";
import { User } from "../user/user.model";
import { IUserRegistration } from "./auth.interface";
import httpStatus from "http-status";

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

export const authService = {
    registerUserIntoDB,
};
