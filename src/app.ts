import express, { Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
//necessary middlewares
app.use(cookieParser());
console.log("  this is cors origin ", process.env.CORS_ORIGIN);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "GET", "PUT", "DELETE"],

    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

console.log(process.env.PORT);

import { userRouter } from "./routes/user.routes.js";
import { taskRouter } from "./routes/task.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
export { app };
