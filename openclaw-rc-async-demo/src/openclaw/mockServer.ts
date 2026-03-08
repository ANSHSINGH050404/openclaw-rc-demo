import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { logger } from "../logger";
import { TaskExecutor } from "./taskExecutor";

export const mockOpenclawTasksHandler = (req: Request, res: Response): void => {
  const { command, callbackUrl } = req.body;

  if (!callbackUrl) {
    res.status(400).json({ error: "callbackUrl is required" });
    return;
  }

  // Generate task ID
  const task_id = `task_${randomUUID()}`;
  logger.info("OC", "Task created", { task_id, command });

  // Start background work
  TaskExecutor.executeTaskAsync(task_id, command, callbackUrl);

  // Return immediate response with task_id
  res.status(202).json({ task_id });
};
