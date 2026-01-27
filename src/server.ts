import { Elysia } from "elysia";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth";
import { todoRoutes } from "./routes/todo";

dotenv.config();

const app = new Elysia();

// Mount route modules
app.use(authRoutes);
app.use(todoRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
