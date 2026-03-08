import express from "express";
import { config } from "./config";
import { logger } from "./logger";
import { slashCommandHandler } from "./rocketchat/slashCommand";
import { callbackHandler } from "./rocketchat/callbackEndpoint";
import { mockOpenclawTasksHandler } from "./openclaw/mockServer";

const app = express();
app.use(express.json());

app.post("/api/slash-command", slashCommandHandler);

app.post("/api/callback", callbackHandler);


// Mock OpenClaw task creation API
app.post("/mock/openclaw/tasks", mockOpenclawTasksHandler);

app.listen(config.port, () => {
  logger.info("SYSTEM", `Server is running on port ${config.port}`);
  logger.info("SYSTEM", `Mock OpenClaw URL: ${config.openclawMockUrl}`);
  logger.info("SYSTEM", `App Callback URL: ${config.appUrl}/api/callback`);
});
