import { logger } from "../logger";

export const MessageService = {
  updateMessage: async (
    roomId: string,
    messageId: string,
    text: string,
  ): Promise<void> => {
    // In a real implementation, this would call Rocket.Chat API: POST /api/v1/chat.update
    logger.info("RC", `Updated message in room ${roomId}: ${text}`);
  },

  sendMessage: async (roomId: string, text: string): Promise<string> => {
    // In a real implementation, this would call Rocket.Chat API: POST /api/v1/chat.sendMessage
    const simulatedMessageId = `msg_${Math.random().toString(36).substr(2, 9)}`;
    logger.info("RC", `Sent placeholder message in room ${roomId}`, {
      simulatedMessageId,
    });
    return simulatedMessageId;
  },
};
