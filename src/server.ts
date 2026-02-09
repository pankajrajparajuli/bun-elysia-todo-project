import dotenv from "dotenv";
dotenv.config();

import { Elysia } from "elysia";
import { register, Counter, Histogram, collectDefaultMetrics } from "prom-client";
import { authRoutes } from "./routes/auth";
import { todoRoutes } from "./routes/todo";
import { redis } from "./db/redis";

// --- Prometheus Setup ---
// Collect default metrics (CPU, Memory, Event Loop)
collectDefaultMetrics();

// Custom metric: Track request count and duration
const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
});

const app = new Elysia();

// --- Middleware to track metrics ---
app.onBeforeHandle(({ request }) => {
  (request as any).startTime = performance.now();
});

app.onAfterHandle(({ request, set, path }) => {
  const start = (request as any).startTime;
  if (start) {
    const duration = (performance.now() - start) / 1000;
    httpRequestDuration.observe(
      { 
        method: request.method, 
        route: path, 
        status_code: set.status || 200 
      },
      duration
    );
  }
});

// --- The /metrics Endpoint ---
app.get("/metrics", async ({ set }) => {
  set.headers["Content-Type"] = register.contentType;
  return await register.metrics();
});

// Mount routes
app.use(authRoutes);
app.use(todoRoutes);

// Health check
app.get("/health", () => ({ status: "ok" }));

// --- Graceful Shutdown ---
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, cleaning up...`);
  try {
    const keys = await redis.keys('todos:*');
    if (keys.length > 0) await redis.del(...keys);
    await redis.quit();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
  console.log(` Prometheus metrics at http://localhost:${port}/metrics`);
});