import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../interface/error";
import AppError from "../errors/AppError";
import handleValidationError from "../errors/handleValidationError";
import config from "../config";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else {
    // Handle specific error types
    if (err?.name === "Validation") {
      const simplifiedError = handleValidationError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError?.errorDetails.errorSources;
    } else if (err?.name === "CastError") {
      const simplifiedError = handleCastError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError?.errorDetails.errorSources;
    } else if (err?.code === 11000) {
      const simplifiedError = handleDuplicateError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError?.errorDetails.errorSources;
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage: err?.message || "An error occurred",
    errorDetails: err,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
