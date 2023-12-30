import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { UserModel } from "./user.model";

const CreateUserIntoDB = async (payload: TUser) => {
  const userData = payload;

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new UserModel({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
  });

  const savedUser = await newUser.save();

  const result = {
    _id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    role: savedUser.role,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  };

  return result;
};

export const UserServices = {
  CreateUserIntoDB,
};
