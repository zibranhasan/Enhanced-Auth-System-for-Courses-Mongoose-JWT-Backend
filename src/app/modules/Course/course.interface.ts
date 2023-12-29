import { Types } from "mongoose";

export type Tag = {
  name: string;
  isDeleted: boolean;
};

export type TCourseDetails = {
  level: string;
  description: string;
};

export type TCourse = {
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
};
