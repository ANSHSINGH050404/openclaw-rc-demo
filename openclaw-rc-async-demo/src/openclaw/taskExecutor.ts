import axios from "axios";
import { logger } from "../logger";

export const TaskExecutor = {
  executeTaskAsync: (task_id: string, command: string, callbackUrl: string) => {
    // Simulate async work
    setTimeout(async () => {
      logger.info("OC", `Executing task ${task_id}`, { command });

      const payload = {
        task_id,
        status: "completed",
        result: "Deployment successful",
      };

      try {
        // Send callback request
        await axios.post(callbackUrl, payload);
        logger.info("OC", "Task completed and callback sent", {
          task_id,
          callbackUrl,
        });
      } catch (error: any) {
        // Retry-safe routing can be implemented here if callback fails
        logger.error("OC", "Failed to send callback", { error: error.message });
      }
    }, 5000); // Wait 5 seconds to simulate work
  },
};
