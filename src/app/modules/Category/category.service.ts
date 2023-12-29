import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const CreateCategoryIntoDB = async (payload: TCategory) => {
  const result = await CategoryModel.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await CategoryModel.find();
  return result;
};

export const CategoryServices = {
  CreateCategoryIntoDB,
  getAllCategoriesFromDB,
};
