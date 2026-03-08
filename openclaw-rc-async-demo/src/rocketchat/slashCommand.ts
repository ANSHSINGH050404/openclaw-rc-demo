import { Request, Response } from "express";
import { logger } from "../logger";
import { MessageService } from "./messageService";
import { TaskRouter } from "../services/taskRouter";

export const slashCommandHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, room_id, text } = req.body;

    logger.info("RC", "Slash command received", { user_id, room_id, text });

    // Send a placeholder message immediately
    const messageId = await MessageService.sendMessage(
      room_id,
      "Processing your request...",
    );

    // Route the task to OpenClaw
    await TaskRouter.routeTask(text, {
      userId: user_id,
      roomId: room_id,
      messageId,
    });

    // Respond to slash command webhook (usually HTTP 200)
    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error("RC", "Error handling slash command", {
      error: error.message,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
