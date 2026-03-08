export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  openclawMockUrl:
    process.env.OPENCLAW_MOCK_URL || "http://localhost:3000/mock/openclaw",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  taskTimeoutMs: 30000,
};
