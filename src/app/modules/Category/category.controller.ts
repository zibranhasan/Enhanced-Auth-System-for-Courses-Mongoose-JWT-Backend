import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { CategoryServices } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const createdBy = req.user.userId; // Assuming user ID is available in the request after authentication
  const payload = {
    ...req.body,
    createdBy,
  };

  const result = await CategoryServices.createCategoryIntoDB(payload);

  const response = {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: {
      _id: result._id,
      name: result.name,
      createdBy: result.createdBy,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    },
  };

  sendResponse(res, response);
});
const getCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: {
      categories: result,
    },
  });
});

export const CategoryController = {
  createCategory,
  getCategory,
};
