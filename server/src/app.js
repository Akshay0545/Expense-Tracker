import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import User from "./models/User.js";

await connectDB();

// Ensure correct indexes on startup to prevent legacy unique index conflicts
try {
  // Drop legacy username unique index if present
  await User.collection.dropIndex("username_1");
} catch (_e) {
  // ignore if index does not exist
}
try {
  // Ensure unique index on email
  await User.collection.createIndex({ email: 1 }, { unique: true });
} catch (_e) {
  // ignore index creation race; Mongo will keep existing correct index
}

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (_req, res) => {
  res.send("LedgerLite API is running. Try /api/health");
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

export default app;