import { Elysia } from "elysia";
import { db } from "../db/client";
import { users } from "../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRoutes = new Elysia()
  // --- Register ---
  .post("/register", async (c) => {
    const { username, password } = await c.body();
    const hash = await bcrypt.hash(password, 10);

    const user = await db.insert(users).values({ username, password: hash }).returning();
    return { message: "User created", user: user[0] };
  })
  // --- Login ---
  .post("/login", async (c) => {
    const { username, password } = await c.body();
    const user = await db.select().from(users).where(users.username.eq(username));

    if (!user[0]) return c.json({ error: "Invalid credentials" }, 401);

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) return c.json({ error: "Invalid credentials" }, 401);

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { token };
  });
