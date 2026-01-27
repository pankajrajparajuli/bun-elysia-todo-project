import { Elysia } from "elysia";
import { db } from "../db/client";
import { users } from "../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const authRoutes = new Elysia({ prefix: "/api" })
  // --- Register ---
  .post("/register", async (context) => {
    const body = await context.body as any;
    const { username, password } = body;
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      context.set.status = 409;
      return { error: "Username already exists" };
    }
    
    const hash = await bcrypt.hash(password, 10);

    const user = await db.insert(users).values({ username, password: hash }).returning();
    return { message: "User created", user: user[0] };
  })
  // --- Login ---
  .post("/login", async (context) => {
    const body = await context.body as any;
    const { username, password } = body;
    const user = await db.select().from(users).where(eq(users.username, username));

    if (!user[0]) {
      context.set.status = 401;
      return { error: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      context.set.status = 401;
      return { error: "Invalid credentials" };
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { token };
  });