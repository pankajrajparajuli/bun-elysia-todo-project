import { Elysia } from "elysia";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { todoRoutes } from "./routes/todo";
import { redis } from "./db/redis";

dotenv.config();

const app = new Elysia();

// Mount route modules
app.use(authRoutes);
app.use(todoRoutes);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, clearing Redis cache...');
  try {
    const keys = await redis.keys('todos:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} cache entries`);
    }
    await redis.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
  process.exit(0);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
