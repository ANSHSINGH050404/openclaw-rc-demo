export const logger = {
  info: (ctx: string, msg: string, data?: any) => {
    console.log(`[${ctx}] ${msg}`, data ? JSON.stringify(data) : "");
  },
  error: (ctx: string, msg: string, data?: any) => {
    console.error(`[${ctx}] ${msg}`, data ? JSON.stringify(data) : "");
  },
  warn: (ctx: string, msg: string, data?: any) => {
    console.warn(`[${ctx}] ${msg}`, data ? JSON.stringify(data) : "");
  },
};
