import { Elysia, t } from "elysia";
import { db } from "../db/client";
import { todos } from "../db/schema";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { redis } from "../db/redis";

// --- Auth middleware ---
const checkAuth = async (context: any) => {
  const authHeader = context.headers.authorization || context.headers.Authorization;

  if (!authHeader) {
    context.set.status = 401;
    throw new Error("Missing token");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    context.set.status = 401;
    throw new Error("Invalid token format");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    context.user = decoded; // attach user info
  } catch {
    context.set.status = 401;
    throw new Error("Invalid token");
  }
};

// --- Todo routes ---
export const todoRoutes = new Elysia({ prefix: "/api" })
  // --- Create Todo ---
  .post("/todos", async (context: any) => {
    await checkAuth(context);
    const body = await context.body as any;
    const { title, description } = body;
    
    console.log("Body received:", body);
    console.log("Title:", title, "Description:", description);

    // Use logged-in user ID from JWT
    const todo = await db
      .insert(todos)
      .values({ title, description: description || null, userId: context.user.id })
      .returning();

    // Invalidate cache
    const cacheKey = `todos:${context.user.id}`;
    await redis.del(cacheKey);

    return { todo: todo[0] };
  })
  // --- Get Todos ---
  .get("/todos", async (context: any) => {
    await checkAuth(context);
    const userId = context.user.id;
    const cacheKey = `todos:${userId}`;

    // Check cache first
    const cachedTodos = await redis.get(cacheKey);
    if (cachedTodos) {
      return { todos: JSON.parse(cachedTodos) };
    }

    // If not in cache, query database
    const allTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId));

    // Cache the result for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(allTodos));

    return { todos: allTodos };
  })
  // --- Update Todo ---
  .patch("/todos/:id", async (context: any) => {
    await checkAuth(context);
    const id = context.params.id;
    const body = await context.body as any;
    const { title, completed } = body;

    // Check if todo exists
    const todo = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)));

    if (todo.length === 0) {
      context.set.status = 404;
      return { error: "Todo not found" };
    }

    // Update todo
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const updated = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, parseInt(id)))
      .returning();

    // Invalidate cache
    const cacheKey = `todos:${context.user.id}`;
    await redis.del(cacheKey);

    return { todo: updated[0] };
  });

