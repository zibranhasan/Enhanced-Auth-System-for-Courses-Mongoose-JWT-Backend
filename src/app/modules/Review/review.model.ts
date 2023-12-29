import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CourseModel",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

const ReviewModel = model<TReview>("Review", reviewSchema);

export default ReviewModel;
