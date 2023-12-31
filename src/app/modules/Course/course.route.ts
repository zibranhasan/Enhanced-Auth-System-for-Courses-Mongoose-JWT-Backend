import express from "express";
import { courseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { courseValidation } from "./course.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../Auth/auth.interface";

const router = express.Router();

router.post(
  "/courses",
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.courseValidationSchema),
  courseController.createCourse
);

router.get("/courses", courseController.getCoursesByQuery);
router.put(
  "/courses/:courseId",
  auth(USER_ROLE.admin),
  validateRequest(courseValidation.courseUpdateValidationSchema),
  courseController.updateCourse
);

router.get(
  "/courses/:courseId/reviews",
  courseController.getCoursesByIdWithReviews
);

router.get("/course/best", courseController.getBestCourseController);

export const CourseRoutes = router;
