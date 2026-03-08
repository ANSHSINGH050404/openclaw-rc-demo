import { logger } from "../logger";
import { TaskStore } from "../store/taskStore";
import { OpenclawClient } from "./openclawClient";
import { MessageService } from "../rocketchat/messageService";
import { config } from "../config";

export const TaskRouter = {
  routeTask: async (
    commandArgs: string,
    context: { userId: string; roomId: string; messageId: string },
  ) => {
    const callbackUrl = `${config.appUrl}/api/callback`;

    // 1. Send POST request to OpenClaw /tasks
    const result = await OpenclawClient.createTask(commandArgs, callbackUrl);

    if (!result || !result.task_id) {
      logger.error("ROUTER", "Failed to receive task_id from OpenClaw");
      await MessageService.updateMessage(
        context.roomId,
        context.messageId,
        "Error: Could not start task.",
      );
      return;
    }

    const { task_id } = result;

    // 2. Store mapping: task_id -> { user_id, room_id, message_id }
    TaskStore.createMapping({
      taskId: task_id,
      userId: context.userId,
      roomId: context.roomId,
      messageId: context.messageId,
      createdAt: Date.now(),
    });

    logger.info("STORE", "Mapping saved", {
      taskId: task_id,
      roomId: context.roomId,
    });

    // Optional: Task timeout protection
    setTimeout(async () => {
      const mapping = TaskStore.getMapping(task_id);
      if (mapping) {
        logger.warn("ROUTER", "Task timeout protected", { taskId: task_id });
        await MessageService.updateMessage(
          mapping.roomId,
          mapping.messageId,
          "Task timed out.",
        );
        TaskStore.deleteMapping(task_id);
      }
    }, config.taskTimeoutMs);
  },
};
