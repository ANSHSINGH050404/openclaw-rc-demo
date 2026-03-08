import axios from "axios";
import { config } from "../config";
import { logger } from "../logger";

export const OpenclawClient = {
  createTask: async (
    commandArgs: string,
    callbackUrl: string,
  ): Promise<{ task_id: string } | null> => {
    try {
      // Send POST request to OpenClaw /tasks
      const response = await axios.post(`${config.openclawMockUrl}/tasks`, {
        command: commandArgs,
        callbackUrl,
      });
      return response.data;
    } catch (error: any) {
      logger.error("OC_CLIENT", "Failed to create task in OpenClaw", {
        error: error.message,
      });
      return null;
    }
  },
};
