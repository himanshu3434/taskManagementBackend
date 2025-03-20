import { Router } from "express";
import {
  addTasks,
  deleteTask,
  getAllTasks,
  updateTasks,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const taskRouter = Router();

taskRouter.get("/all", verifyJWT, getAllTasks);
taskRouter.post("/add", verifyJWT, addTasks);
taskRouter.post("/update/:id", verifyJWT, updateTasks);
taskRouter.delete("/delete", verifyJWT, deleteTask);

export { taskRouter };
