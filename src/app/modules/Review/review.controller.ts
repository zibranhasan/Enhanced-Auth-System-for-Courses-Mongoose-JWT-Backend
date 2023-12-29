import httpStatus from "http-status";
import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.CreateReviewIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
