import httpStatus from "http-status";
import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginController = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const result = await AuthServices.loginUser(username, password);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User login successful",
    data: {
      user: result.user,
      token: result.token,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { userId } = req.user; // Assuming userId is available in the request after authentication
  const { currentPassword, newPassword } = req.body;

  const updatedUser = await AuthServices.changePassword({
    userId,
    currentPassword,
    newPassword,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password is updated  successfully!",
    data: updatedUser,
  });
});

export const AuthControllers = {
  loginController,
  changePassword,
};
