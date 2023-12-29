import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post(
  "/categories",
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.get(
  "/categories",

  CategoryController.getCategory
);

export const CategoryRoutes = router;
