import express from "express";
import path from "path";
import { config } from "./config";
import { logger } from "./logger";
import { slashCommandHandler } from "./rocketchat/slashCommand";
import { callbackHandler } from "./rocketchat/callbackEndpoint";
import { mockOpenclawTasksHandler } from "./openclaw/mockServer";
import { messageEmitter } from "./rocketchat/messageService";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serve mock chat UI

// Server-Sent Events endpoint to stream messages to the frontend UI
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const listener = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  messageEmitter.on("message", listener);

  req.on("close", () => {
    messageEmitter.off("message", listener);
  });
});

app.post("/api/slash-command", slashCommandHandler);
app.post("/api/callback", callbackHandler);
app.post("/mock/openclaw/tasks", mockOpenclawTasksHandler);

app.listen(config.port, () => {
  logger.info("SYSTEM", `Server running on port ${config.port}`);
  logger.info(
    "SYSTEM",
    `Open frontend to test UI: http://localhost:${config.port}`,
  );
});
