/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application } from "express";
import cors from "cors";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { CourseRoutes } from "./app/modules/Course/course.route";
import { CategoryRoutes } from "./app/modules/Category/category.route";
import { ReviewRoutes } from "./app/modules/Review/review.route";
import { UserRoutes } from "./app/modules/User/user.route";
import { AuthRoutes } from "./app/modules/Auth/auth.route";
// import globalErrorHandler from "./app/middlewares/globalErrorhandler";
// import notFound from "./app/middlewares/notFound";
// import router from "./app/routes";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//application routes
app.use("/api/auth", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api", CourseRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", ReviewRoutes);

// const test = async (req: Request, res: Response) => {
//   Promise.reject();
// };

// app.get('/', test);

app.use(globalErrorHandler);

//Not Found
// app.use(notFound);

export default app;
