import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export const createToken = (
  jwtPayload: { _id: Types.ObjectId; role: "user" | "admin"; email: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(
    {
      userId: jwtPayload._id.toString(), // Convert ObjectId to string
      role: jwtPayload.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
