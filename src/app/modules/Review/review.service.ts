import { TUser } from "../User/user.interface";
import { TReview } from "./review.interface";
import ReviewModel from "./review.model";

const CreateReviewIntoDB = async (
  payload: TReview & { createdBy: TUser["_id"] }
): Promise<TReview> => {
  const createdReview = await ReviewModel.create(payload);

  // Populate createdBy with user details
  const populatedReview = await ReviewModel.findById(createdReview._id)
    .populate("createdBy", "username email role")
    .exec();

  if (!populatedReview) {
    throw new Error("Review not found after populating createdBy.");
  }

  return populatedReview.toObject();
};

export const ReviewServices = {
  CreateReviewIntoDB,
};
