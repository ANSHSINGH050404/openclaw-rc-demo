import { Request, Response } from "express";
import { logger } from "../logger";
import { TaskStore } from "../store/taskStore";
import { MessageService } from "./messageService";

export const callbackHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { task_id, status, result } = req.body;

    // 1. Validate request payload
    if (!task_id) {
      res.status(400).json({ error: "task_id is required" });
      return;
    }

    // 2. Lookup task_id in TaskStore
    const mapping = TaskStore.getMapping(task_id);
    if (!mapping) {
      // Could be idempotent callback handling or timeout already occurred
      logger.error("RC", "Error handling callback: missing mapping", {
        task_id,
      });
      res.status(404).json({ error: "Mapping not found" });
      return;
    }

    // 3. Update the original message in Rocket.Chat
    let updateText = `Task ended with status: ${status}`;
    if (result) updateText = result;

    await MessageService.updateMessage(
      mapping.roomId,
      mapping.messageId,
      updateText,
    );
    logger.info("RC", "Message updated via callback", { taskId: task_id });

    // 4. Delete mapping after completion (avoid memory leaks)
    TaskStore.deleteMapping(task_id);

    res.status(200).json({ success: true });
  } catch (error: any) {
    logger.error("RC", "Error handling callback", { error: error.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
};
