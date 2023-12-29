export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage?: string;
  errorDetails: {
    issues?: TErrorSources;
    name: string;
    [key: string]: any; // Allow any other properties
  };
};
