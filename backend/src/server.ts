import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { checkDbConnection, pool } from "./db";
import customersRouter from "./routes/customers";
import inquiriesRouter from "./routes/inquiries";
import storeSettingsRouter from "./routes/store-settings";
import ticketsRouter from "./routes/tickets";

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await checkDbConnection();
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "error", message: "database not reachable" });
  }
});

app.use("/api/customers", customersRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/store-settings", storeSettingsRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.issues,
    });
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

async function bootstrap() {
  await checkDbConnection();

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server:", error);
  await pool.end();
  process.exit(1);
});
