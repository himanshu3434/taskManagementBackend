import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/registerUser", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);
userRouter.post("/logout", verifyJWT, logoutUser);

export { userRouter };
