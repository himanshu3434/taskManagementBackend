import { Response, NextFunction } from "express";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

import { CustomRequest } from "../types/types.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export const verifyJWT = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);
    if (!token)
      return res
        .status(404)
        .json(new apiResponse(false, 404, null, "User Not Found"));

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    const user = await client.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) throw new apiError(401, "Invalid Access Token");
    console.log("user", user);
    req.user = user;

    next();
  }
);
