import { pgTable, serial, text, boolean, integer,varchar } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});

// Todos table
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 25 }).notNull(),
  description: varchar("description", { length: 255 }),
  completed: boolean("completed").default(false)
});

