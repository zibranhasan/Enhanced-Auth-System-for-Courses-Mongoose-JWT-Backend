import mongoose, { Types } from "mongoose";

export type Tag = {
  name: string;
  isDeleted: boolean;
};

export type TCourseDetails = {
  level: string;
  description: string;
};

export type TCourse = {
  _id: mongoose.Types.ObjectId;
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: Tag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: TCourseDetails;
  createdBy?: Types.ObjectId | null; // Update the type to allow null
  createdAt?: Date | null; // Update the type to allow null
  updatedAt?: Date | null; // Update the type to allow null
};
