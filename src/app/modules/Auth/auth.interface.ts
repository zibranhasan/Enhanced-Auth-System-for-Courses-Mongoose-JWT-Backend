import { TUser } from "../User/user.interface";

export type TLoginUser = {
  username: string;
  password: string;
};

export type TChangePassword = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;
export type TUserRole = keyof typeof USER_ROLE;

export type TChangePasswordResult = Pick<
  TUser,
  "_id" | "username" | "email" | "role" | "createdAt" | "updatedAt"
>;
