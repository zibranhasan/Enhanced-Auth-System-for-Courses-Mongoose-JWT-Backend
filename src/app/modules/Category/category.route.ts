import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../Auth/auth.interface";

const router = express.Router();

router.post(
  "/categories",
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.get(
  "/categories",

  CategoryController.getCategory
);

export const CategoryRoutes = router;
