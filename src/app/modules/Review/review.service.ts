import { TReview } from "./review.interface";
import ReviewModel from "./review.model";

const CreateReviewIntoDB = async (payload: TReview) => {
  const result = ReviewModel.create(payload);
  return result;
};

export const ReviewServices = {
  CreateReviewIntoDB,
};
