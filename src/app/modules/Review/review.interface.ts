import mongoose, { Types } from "mongoose";
import { TUser } from "../User/user.interface";

export type TReview = {
  _id: mongoose.Types.ObjectId;
  courseId: Types.ObjectId;
  rating: number;
  review: string;
  createdBy?: TUser | null; // Now createdBy can be an entire TUser or null
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
