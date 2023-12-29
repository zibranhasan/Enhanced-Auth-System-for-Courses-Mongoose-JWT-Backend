import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.CreateCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategory,
};
