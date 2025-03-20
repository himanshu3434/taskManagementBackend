import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types/types.js";
import {
  accessTokencookieOptions,
  refreshTokencookieOptions,
} from "../constants.js";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const hashPassword = async (password: string) => {
  let hpassword = await bcrypt.hash(password, 10);

  return hpassword;
};
const isPasswordCorrect = async (password: string, userPassword: string) => {
  const passwordCheck = await bcrypt.compare(password, userPassword);
  return passwordCheck;
};

const generateAccessTokens = (userId: number) => {
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "1d",
  });
};
const generateRefreshTokens = (userId: number) => {
  const secret: string = process.env.REFRESH_TOKEN_SECRET as string;
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "10d",
  });
};

const generateAccessAndRefreshTokesn = async (userId: number) => {
  const accessToken = generateAccessTokens(userId);
  const refreshToken = generateRefreshTokens(userId);
  if (userId) {
    const user = await client.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  }

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  //check if any field is empty

  if ([email, password, name].some((field) => field?.trim() === "")) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields Are Required"));
  }
  console.log("name", name, "email", email, "password", password);
  const existingUser = await client.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser)
    return res
      .status(409)
      .json(
        new apiResponse(false, 409, null, "User with This email Already exist")
      );
  let hshpass = await hashPassword(password);
  const user = await client.user.create({
    data: {
      email: email,
      name: name,
      password: hshpass,
    },
  });

  const newUser = await client.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!newUser)
    return res
      .status(500)
      .json(
        new apiResponse(
          false,
          500,
          null,
          "Internal Server Error While Registering the User "
        )
      );
  res
    .status(201)
    .json(new apiResponse(true, 200, newUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || [password].some((field) => field.trim() === "")) {
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "All Fields are Required"));
  }

  const user = await client.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user)
    return res
      .status(200)
      .json(new apiResponse(false, 404, null, "User Not Found"));

  const passwordValid = await isPasswordCorrect(password, user.password);
  // console.log("passwordValid", passwordValid);
  if (!passwordValid)
    return res
      .status(200)
      .json(new apiResponse(false, 401, null, "Unauthorised User"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokesn(
    user.id
  );
  const finalUser = await client.user.findUnique({
    where: {
      id: user.id,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokencookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokencookieOptions)
    .json(
      new apiResponse(
        true,
        200,
        { user: finalUser, accessToken, refreshToken },
        "User Logged In SuccessFully"
      )
    );
});

const logoutUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  const user = req.user;
  if (!user)
    return res
      .status(404)
      .json(new apiResponse(false, 404, null, "User Not Found"));
  const updatedUser = await client.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: "",
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken", accessTokencookieOptions)
    .clearCookie("refreshToken", refreshTokencookieOptions)
    .json(
      new apiResponse(
        true,
        200,
        { loggedOut: true },
        "User logged Out SuccessFully"
      )
    );
});
const getCurrentUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    res
      .status(200)
      .json(new apiResponse(true, 200, { user: req.user }, "User Data"));
  }
);

export { registerUser, loginUser, logoutUser, getCurrentUser };
