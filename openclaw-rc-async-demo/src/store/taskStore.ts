export interface TaskSession {
  taskId: string;
  roomId: string;
  userId: string;
  messageId: string;
  createdAt: number;
}

// Simple in-memory storage using Map
const store = new Map<string, TaskSession>();

export const TaskStore = {
  createMapping(session: TaskSession): void {
    store.set(session.taskId, session);
  },

  getMapping(taskId: string): TaskSession | undefined {
    return store.get(taskId);
  },

  deleteMapping(taskId: string): boolean {
    return store.delete(taskId);
  },

  // For demonstration/debugging
  getAllMappings(): Map<string, TaskSession> {
    return store;
  },
};
