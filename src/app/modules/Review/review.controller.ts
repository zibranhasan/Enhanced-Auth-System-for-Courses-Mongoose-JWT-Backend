import httpStatus from "http-status";
import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";
import { TUser } from "../User/user.interface";

const createReview = catchAsync(async (req, res) => {
  // Assuming user ID is available in the request after authentication
  const createdBy = req.user.userId;

  const payload = {
    ...req.body,
    createdBy,
  };

  const result = await ReviewServices.CreateReviewIntoDB(payload);

  const response = {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: {
      _id: result._id,
      courseId: result.courseId,
      rating: result.rating,
      review: result.review,
      createdBy: mapUserFields(result.createdBy), // Map user fields
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    },
  };

  sendResponse(res, response);
});

// Helper function to map user fields
const mapUserFields = (user: TUser | null | undefined) => {
  if (!user) {
    return null;
  }

  const { _id, username, email, role } = user;
  return { _id, username, email, role };
};

export const reviewController = {
  createReview,
};
