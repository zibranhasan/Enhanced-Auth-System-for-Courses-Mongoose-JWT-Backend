import mongoose, { Types } from "mongoose";
import { TUser } from "../User/user.interface";

export type TCategory = {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdBy?: Types.ObjectId | null | TUser; // Update the type to allow null
  createdAt?: Date | null; // Update the type to allow null
  updatedAt?: Date | null; // Update the type to allow null
};
