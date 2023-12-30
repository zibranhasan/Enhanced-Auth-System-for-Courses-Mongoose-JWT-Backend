import express from "express";
import { ReviewValidation } from "./review.validation";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../Auth/auth.interface";

const router = express.Router();

router.post(
  "/reviews",
  auth(USER_ROLE.user),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

export const ReviewRoutes = router;
