import mongoose from "mongoose";

export type TUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  passwordHistory: { password: string; updatedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
};
