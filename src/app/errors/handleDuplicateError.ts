import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Duplicate Entry",
    errorMessage: `${extractedMessage} is already exist`,
    errorDetails: {
      name: "DuplicateError",
      issues: errorSources,
    },
  };
};

export default handleDuplicateError;
