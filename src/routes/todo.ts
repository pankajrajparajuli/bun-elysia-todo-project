import { Elysia } from "elysia";
import { db } from "../db/client";
import { todos } from "../db/schema";
import jwt from "jsonwebtoken";

const auth = async (c, next) => {
  const header = c.req.headers.get("authorization");
  if (!header) return c.json({ error: "Missing token" }, 401);

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    c.set("user", decoded);
    return next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export const todoRoutes = new Elysia()
  // --- Create Todo ---
  .post("/todos", auth, async (c) => {
    const { title } = await c.body();
    const user = c.get("user");

    const todo = await db.insert(todos).values({ title, userId: user.id }).returning();
    return { todo: todo[0] };
  })
  // --- Get Todos ---
  .get("/todos", auth, async (c) => {
    const user = c.get("user");
    const allTodos = await db.select().from(todos).where(todos.userId.eq(user.id));
    return { todos: allTodos };
  });
