import httpStatus from "http-status";
import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import { courseServices } from "./course.service";
import { Request, Response } from "express";
import { CourseModel } from "./course.model";
import { TCourse } from "./course.interface";

const createCourse = catchAsync(async (req, res) => {
  const { startDate, endDate, ...restCourseData } = req.body;

  const calculateDurationInWeeks = (
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationInMilliseconds = Math.abs(end.getTime() - start.getTime());

    const durationInWeeks = Math.ceil(
      durationInMilliseconds / (7 * 24 * 60 * 60 * 1000)
    );
    return durationInWeeks;
  };

  const calculatedDurationInWeeks = calculateDurationInWeeks(
    startDate,
    endDate
  );

  const createdBy = req.user.userId;
  const payload = {
    ...restCourseData,
    startDate,
    endDate,
    durationInWeeks: calculatedDurationInWeeks,
    createdBy,
  };

  const result: TCourse = await courseServices.CreateCourseIntoDB(payload);

  const response = {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: {
      _id: result._id,
      title: result.title,
      instructor: result.instructor,
      categoryId: result.categoryId,
      price: result.price,
      tags: result.tags,
      startDate: result.startDate,
      endDate: result.endDate,
      language: result.language,
      provider: result.provider,
      durationInWeeks: result.durationInWeeks,
      details: result.details,
      createdBy,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    },
  };

  sendResponse(res, response);
});

interface CustomRequest extends Request {
  query: {
    page?: string;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: string;
    maxPrice?: string;
    tags?: string;
    startDate?: string;
    endDate?: string;
    language?: string;
    provider?: string;
    durationInWeeks?: string;
    level?: string;
    limit?: string;
  };
}

const getCoursesByQuery = async (req: CustomRequest, res: Response) => {
  try {
    const {
      page = "1",
      sortBy = "startDate",
      sortOrder = "asc",
      minPrice,
      maxPrice,
      tags,
      startDate,
      endDate,
      language,
      provider,
      durationInWeeks,
      level,
    } = req.query;

    const filter: any = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (tags) filter["tags.name"] = tags;
    if (startDate) filter.startDate = { $gte: startDate };
    if (endDate) filter.endDate = { $lte: endDate };
    if (language) filter.language = language;
    if (provider) filter.provider = provider;
    if (durationInWeeks) filter.durationInWeeks = durationInWeeks;
    if (level) filter["details.level"] = level;

    const { totalCount, totalPages, courses } =
      await courseServices.getCoursesFromDB(
        filter,
        sortBy,
        sortOrder,
        parseInt(page, 10),
        parseInt(req.query.limit || "10", 10)
      );

    res?.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Courses retrieved successfully",
      meta: {
        page: parseInt(page, 10),
        limit: parseInt(req.query.limit || "10", 10),
        total: totalCount,
      },
      data: {
        courses,
      },
    });
  } catch (error: any) {
    res?.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await courseServices.updateCourseIntoDB(courseId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

const getCoursesByIdWithReviews = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Course not found",
    });
  }

  const reviews = await courseServices.getCoursesByIdWithReviewsFromDB(
    courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course and Reviews retrieved successfully",
    data: { course, reviews },
  });
});

const getBestCourseController = catchAsync(async (req, res) => {
  const result = await courseServices.getBestCourseFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best course retrieved successfully",
    data: {
      course: result.course,
      averageRating: result.averageRating,
      reviewCount: result.reviewCount,
    },
  });
});

export const courseController = {
  createCourse,
  getCoursesByQuery,
  updateCourse,
  getCoursesByIdWithReviews,
  getBestCourseController,
};
