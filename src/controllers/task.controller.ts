import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { CustomRequest } from "../types/types.js";

import { Status } from "@prisma/client";

const client = new PrismaClient();
const getAllTasks = asyncHandler(async (req: CustomRequest, res: Response) => {
  let taskList = await client.task.findMany({
    where: {
      userId: req.user?.id,
    },
  });

  res
    .status(200)
    .json(
      new apiResponse(true, 200, taskList, "All Tasks fetched successfully")
    );
});

const addTasks = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { heading, description }: { heading: string; description: string } =
    req.body;
  const userId = req.user?.id;
  console.log("user ", req.user);
  if (userId === undefined) {
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "User not found"));
  }
  const newTask = await client.task.create({
    data: {
      heading: heading,
      userId: userId,
      description: description,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  res
    .status(200)
    .json(new apiResponse(true, 200, newTask, "Task added successfully"));
});

const updateTasks = asyncHandler(async (req: CustomRequest, res: Response) => {
  const user = req.user;
  const taskId = req.params.id;
  const {
    heading,
    description,
    status,
  }: { heading: string; description: string; status: Status } = req.body;

  if (user === undefined) {
    return res
      .status(401)
      .json(new apiResponse(false, 401, null, "User not found"));
  }
  const taskUpdate = await client.task.update({
    where: {
      id: parseInt(taskId),
    },
    data: {
      heading: heading,
      description: description,
      status: status,
      updatedAt: new Date(),
    },
  });

  res
    .status(200)
    .json(new apiResponse(true, 200, taskUpdate, "Task Updated  successfully"));
});
const deleteTask = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res
      .status(400)
      .json(new apiResponse(false, 400, null, "TaskId not found "));
  }
  let time = new Date();
  const deleteTask = await client.task.delete({
    where: {
      id: taskId,
    },
  });

  res
    .status(200)
    .json(new apiResponse(true, 200, deleteTask, "Task Deleted successfully"));
});

export { getAllTasks, addTasks, updateTasks, deleteTask };
