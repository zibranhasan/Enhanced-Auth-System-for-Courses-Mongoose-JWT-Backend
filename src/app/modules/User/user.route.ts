import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(UserValidation.userValidationSchema),
  userController.createUser
);

export const UserRoutes = router;
