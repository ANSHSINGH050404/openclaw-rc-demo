import { EventEmitter } from "events";
import { logger } from "../logger";

export const messageEmitter = new EventEmitter();

export const MessageService = {
  updateMessage: async (
    roomId: string,
    messageId: string,
    text: string,
  ): Promise<void> => {
    logger.info("RC", `Updated message in room ${roomId}: ${text}`);
    messageEmitter.emit("message", { type: "update", roomId, messageId, text });
  },

  sendMessage: async (
    roomId: string,
    text: string,
    senderId?: string,
  ): Promise<string> => {
    const simulatedMessageId = `msg_${Math.random().toString(36).substr(2, 9)}`;
    logger.info("RC", `Sent placeholder message in room ${roomId}`, {
      simulatedMessageId,
    });
    messageEmitter.emit("message", {
      type: "new",
      roomId,
      messageId: simulatedMessageId,
      text,
      senderId,
    });
    return simulatedMessageId;
  },
};
