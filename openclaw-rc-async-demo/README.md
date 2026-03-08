# OpenClaw ↔ Rocket.Chat Async Task Demo

This project provides a **production-quality proof-of-concept** demonstrating asynchronous task routing between Rocket.Chat and OpenClaw. It's designed to simulate long-running tasks for agentic workflows where tasks may take minutes or hours.

## Features Included

- ✅ **Task Creation:** Mapping user requests to tasks.
- ✅ **Task Store:** Managing persistent mapping `task_id → { room_id, message_id }`.
- ✅ **Mock OpenClaw:** Simulates long-running agentic tasks.
- ✅ **Async Callback Routing:** Matches OpenClaw webhooks back to the original Rocket.Chat context.
- ✅ **Reliability:** Timeout protection, idempotent callback handling, mapped storage cleanup.

## Requirements

- Node.js (v18+)

## How to Install Dependencies

```bash
npm install
```

## How to Start the Server

We use `ts-node` for a fast development experience without the need to compile manually.

```bash
npm run start
```

_(You can also use `npx ts-node src/app.ts`)_

## How to Simulate a Command

You can use `curl`, Postman, or any HTTP client to simulate a Rocket.Chat slash command.

Open a terminal and run the following command to simulate a user typing `/openclaw deploy repo`:

```bash
curl -X POST http://localhost:3000/api/slash-command \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_demo_1",
    "room_id": "room_demo_1",
    "text": "deploy repo"
  }'
```

## Expected Console Output

When you run the above simulation, the console output will demonstrate the full asynchronous flow:

```
[SYSTEM] Server is running on port 3000
[SYSTEM] Mock OpenClaw URL: http://localhost:3000/mock/openclaw
[SYSTEM] App Callback URL: http://localhost:3000/api/callback
[RC] Slash command received {"user_id":"user_demo_1","room_id":"room_demo_1","text":"deploy repo"}
[RC] Sent placeholder message in room room_demo_1 {"simulatedMessageId":"msg_xxxxxxxxx"}
[OC] Task created {"task_id":"task_12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx","command":"deploy repo"}
[STORE] Mapping saved {"taskId":"task_12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx","roomId":"room_demo_1"}

... (Wait 5 seconds) ...

[OC] Executing task task_12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx {"command":"deploy repo"}
[OC] Task completed and callback sent {"task_id":"task_12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx","callbackUrl":"http://localhost:3000/api/callback"}
[RC] Updated message in room room_demo_1: Deployment completed successfully 🚀 (Task: deploy repo)
[RC] Message updated via callback {"taskId":"task_12345678-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```

## Project Structure

- `src/rocketchat/` - Rocket.Chat specific endpoints and services.
- `src/openclaw/` - Mock OpenClaw API endpoints and background execution.
- `src/services/` - Integration logic joining RC and OC.
- `src/store/` - In-memory Map testing the task storage (can be replaced by Redis in a real implementation).
- `diagrams/async-sequence.md` - Mermaid diagram of the async lifecycle.
