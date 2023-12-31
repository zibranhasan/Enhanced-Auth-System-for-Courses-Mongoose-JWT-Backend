import { FilterQuery, SortOrder, Document } from "mongoose";
import { TCourse } from "./course.interface";
import { CourseModel } from "./course.model";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import ReviewModel from "../Review/review.model";

const CreateCourseIntoDB = async (payload: TCourse): Promise<TCourse> => {
  // Assuming admin user ID is available in the request after authentication
  const adminUserId = payload.createdBy || null;

  // Explicitly set createdBy, createdAt, and updatedAt fields
  const currentDate = new Date();
  const courseData = {
    ...payload,
    createdBy: adminUserId,
    createdAt: currentDate,
    updatedAt: currentDate, // Set updatedAt to the same value as createdAt initially
  };

  const result = await CourseModel.create(courseData);

  // Convert to plain JavaScript object before returning
  const resultObject = result.toObject();

  // Convert createdAt and updatedAt to Date objects
  const createdAt = resultObject.createdAt
    ? new Date(resultObject.createdAt)
    : null;
  const updatedAt = resultObject.updatedAt
    ? new Date(resultObject.updatedAt)
    : null;

  return {
    ...resultObject,
    createdBy: adminUserId,
    createdAt,
    updatedAt,
  };
};

const getCoursesFromDB = async (
  filter: FilterQuery<TCourse>,
  sortBy: string,
  sortOrder: string,
  page: number,
  limit: number
) => {
  const totalCount = await CourseModel.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const sortOptions: { [key: string]: "asc" | "desc" } = {};
  sortOptions[sortBy] = sortOrder as "asc" | "desc";

  const courses = await CourseModel.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "createdBy",
      select: "_id username email role",
    })
    .lean();

  const transformedCourses: any[] = courses.map((course: any) => {
    const createdBy = course.createdBy || null;

    const transformedCourse: any = {
      ...course,
      createdBy,
    };

    return transformedCourse;
  });
  return { totalCount, totalPages, courses: transformedCourses };
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  try {
    // Step 1: Basic course info update
    const { tags, details, ...courseRemainingData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
      ...courseRemainingData,
    };

    // Step 2: Update the 'details' field if provided
    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedUpdatedData[`details.${key}`] = value;
      }
    }

    // Step 3: Perform the main update
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "createdBy",
        select: "_id username email role",
      })
      .lean();

    if (!updatedCourse) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
    }

    // Step 4: Check and update tags
    if (tags && tags.length > 0) {
      const deletedTags = tags
        .filter((el) => el.name && el.isDeleted)
        .map((el) => el.name);

      // Remove deleted tags
      await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: deletedTags } },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // Add new tags
      const newTags = tags.filter((el) => el.name && !el.isDeleted);
      await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: newTags } },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    // Format the response
    const formattedResponse = {
      success: true,
      statusCode: httpStatus.OK,
      message: "Course updated successfully",
      data: {
        _id: updatedCourse._id,
        title: updatedCourse.title,
        instructor: updatedCourse.instructor,
        categoryId: updatedCourse.categoryId,
        price: updatedCourse.price,
        tags: updatedCourse.tags,
        startDate: updatedCourse.startDate,
        endDate: updatedCourse.endDate,
        language: updatedCourse.language,
        provider: updatedCourse.provider,
        durationInWeeks: updatedCourse.durationInWeeks,
        details: updatedCourse.details,
        createdBy: updatedCourse.createdBy,
        createdAt: updatedCourse.createdAt,
        updatedAt: updatedCourse.updatedAt,
      },
    };

    return formattedResponse;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
  }
};

const getCoursesByIdWithReviewsFromDB = async (courseId: string) => {
  const course = await CourseModel.findById(courseId)
    .populate({
      path: "createdBy",
      select: "_id username email role",
    })
    .lean();

  if (!course) {
    return null; // Or handle the case where the course is not found
  }

  const reviews = await ReviewModel.find({ courseId })
    .populate({
      path: "createdBy",
      select: "_id username email role",
    })
    .lean();

  return { course, reviews };
};

const getBestCourseFromDB = async () => {
  try {
    const courses = await CourseModel.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "courseId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $avg: "$reviews.rating",
          },
          reviewCount: {
            $size: "$reviews",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          instructor: 1,
          categoryId: 1,
          price: 1,
          startDate: 1,
          endDate: 1,
          language: 1,
          provider: 1,
          durationInWeeks: 1,
          details: 1,
          averageRating: 1,
          reviewCount: 1,
          createdBy: {
            _id: 1,
            username: 1,
            email: 1,
            role: 1,
          },
          createdAt: 1,
          updatedAt: 1,
          tags: {
            $filter: {
              input: "$tags",
              as: "tag",
              cond: { $eq: ["$$tag.isDeleted", false] },
            },
          },
        },
      },
      {
        $sort: {
          averageRating: -1,
          reviewCount: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (courses.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No courses found");
    }

    const bestCourse = courses[0];

    return {
      course: bestCourse,
      averageRating: bestCourse.averageRating,
      reviewCount: bestCourse.reviewCount,
    };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in getting best review course"
    );
  }
};

export const courseServices = {
  CreateCourseIntoDB,
  getCoursesFromDB,
  updateCourseIntoDB,
  getCoursesByIdWithReviewsFromDB,
  getBestCourseFromDB,
};
