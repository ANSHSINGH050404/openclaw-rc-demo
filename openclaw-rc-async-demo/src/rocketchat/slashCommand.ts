import { Request, Response } from "express";
import { logger } from "../logger";
import { MessageService } from "./messageService";
import { TaskStore } from "../store/taskStore";
import { OpenclawClient } from "../services/openclawClient";
import { config } from "../config";

export const slashCommandHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, room_id, text } = req.body;

    logger.info("RC", "Slash command received", { user_id, room_id, text });

    // Simulate user typing message in the exact style
    await MessageService.sendMessage(room_id, text, user_id);

    // Call OpenClaw
    const callbackUrl = `${config.appUrl}/api/callback`;
    const result = await OpenclawClient.createTask(text, callbackUrl);

    if (!result || !result.task_id) {
      await MessageService.sendMessage(room_id, "Error: Could not start task.");
      res.status(200).json({ success: true });
      return;
    }

    const { task_id } = result;

    // Send the bot reply
    const botMessageId = await MessageService.sendMessage(
      room_id,
      `Processing task...\ntask_id: ${task_id}`,
    );

    // Create the memory mapping
    TaskStore.createMapping({
      taskId: task_id,
      userId: user_id,
      roomId: room_id,
      messageId: botMessageId,
      createdAt: Date.now(),
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error("RC", "Error handling slash command", {
      error: error.message,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
