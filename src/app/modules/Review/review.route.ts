import express from "express";
import { ReviewValidation } from "./review.validation";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/reviews",
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

export const ReviewRoutes = router;
