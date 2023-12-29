import { Schema, Types, model } from "mongoose";
import { TCourse, TCourseDetails, Tag } from "./course.interface";

const tagSchema = new Schema<Tag>({
  name: { type: String, required: true },
  isDeleted: { type: Boolean, required: true },
});
//schema for CourseDetails
const courseDetailsSchema = new Schema<TCourseDetails>({
  level: { type: String, required: true },
  description: { type: String, required: true },
});

export const courseSchema = new Schema<TCourse>({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: [true, "User id is required"],
    ref: "CategoryModel",
  },
  price: { type: Number, required: true },
  tags: { type: [tagSchema], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number, required: true },
  details: { type: courseDetailsSchema, required: true },
});

export const CourseModel = model<TCourse>("course", courseSchema);
