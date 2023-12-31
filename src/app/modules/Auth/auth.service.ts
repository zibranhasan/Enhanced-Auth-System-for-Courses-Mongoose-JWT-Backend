import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../User/user.model";
import {
  TChangePassword,
  TChangePasswordResult,
  TLoginUser,
} from "./auth.interface";
import { createToken } from "./auth.utils";
import bcrypt from "bcrypt";
import config from "../../config";
import { TUser } from "../User/user.interface";
import { Types } from "mongoose";

const loginUser = async (username: string, password: string) => {
  // Checking if the user exists
  const user = await UserModel.findOne({ username });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  // // Create token and send it to the client
  // const jwtPayload = {
  //   _id: user._id,
  //   role: user.role,
  //   email: user.email,
  // };

  // Change the type of jwtPayload to explicitly include "user" | "admin" for the role property
  const jwtPayload: {
    _id: Types.ObjectId;
    role: "user" | "admin"; // Ensure it is explicitly typed
    email: string;
  } = {
    _id: user._id,
    role: user.role as "user" | "admin", // Type assertion to ensure compatibility
    email: user.email,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Return only the user details and token
  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return {
    user: userData,
    token,
  };
};

const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}: TChangePassword) => {
  const user = (await UserModel.findById(userId)) as Document & TUser;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Checking if the current password is correct
  const isCurrentPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect"
    );
  }

  // Checking if the new password is unique and different from the current password
  const isPasswordUnique = await isUniquePassword(user, newPassword);

  if (!isPasswordUnique) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${user.passwordHistory[0].updatedAt}).`
    );
  }

  // Update user's password and passwordHistory
  user.passwordHistory = [
    { password: user.password, updatedAt: new Date() },
    ...user.passwordHistory.slice(0, 1),
  ]; // Add the current password to history
  user.password = await bcrypt.hash(newPassword, 10);

  // Ensure that the save method is recognized
  const userWithSave = user as Document &
    TUser & { save(): Promise<Document & TUser> };
  await userWithSave.save();

  // Return updated user details
  const updatedUser: TChangePasswordResult = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return updatedUser;
};

// Helper function to check if the new password is unique
const isUniquePassword = async (
  user: Document & TUser,
  newPassword: string
) => {
  if (!user.passwordHistory) {
    return true;
  }

  const uniquePasswords = user.passwordHistory
    .map((entry) => entry.password)
    .filter((savedPassword) => savedPassword !== newPassword);

  return uniquePasswords.length >= user.passwordHistory.length - 2;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
