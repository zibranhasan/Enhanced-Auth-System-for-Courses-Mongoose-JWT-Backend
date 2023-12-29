import express from "express";
import { courseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { courseValidation } from "./course.validation";

const router = express.Router();

router.post(
  "/course",
  validateRequest(courseValidation.courseValidationSchema),
  courseController.createCourse
);

router.get("/courses", courseController.getCoursesByQuery);
router.put(
  "/courses/:courseId",
  validateRequest(courseValidation.courseUpdateValidationSchema),
  courseController.updateCourse
);

router.get(
  "/courses/:courseId/reviews",
  courseController.getCoursesByIdWithReviews
);

router.get("/course/best", courseController.getBestCourseController);

export const CourseRoutes = router;
