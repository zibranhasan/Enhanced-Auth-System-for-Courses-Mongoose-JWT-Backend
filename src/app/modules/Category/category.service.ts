import { Types } from "mongoose";
import { TUser } from "../User/user.interface";
import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategoryIntoDB = async (payload: TCategory): Promise<TCategory> => {
  // Assuming admin user ID is available in the request after authentication
  const adminUserId = payload.createdBy || null;

  // Explicitly set createdBy, createdAt, and updatedAt fields
  const currentDate = new Date();
  const categoryData = {
    ...payload,
    createdBy: adminUserId,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  const result = await CategoryModel.create(categoryData);

  return result.toObject();
};

const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find().populate(
    "createdBy",
    "username email role"
  ); // Populate createdBy with selected fields

  return result.map((category) => {
    const { _id, name, createdBy, createdAt, updatedAt } = category;
    return {
      _id,
      name,
      createdBy: mapUserFields(createdBy),
      createdAt,
      updatedAt,
    };
  });
};

// Helper function to map user fields
const mapUserFields = (user: TUser | Types.ObjectId | null | undefined) => {
  if (!user) {
    return null;
  }

  // Check if the user is an instance of the User model (TUser)
  if (user instanceof Types.ObjectId) {
    // If it's an ObjectId, return null or handle it based on your requirement
    return null;
  }

  const { _id, username, email, role } = user;
  return { _id, username, email, role };
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
