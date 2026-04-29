"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("./db");
const customers_1 = __importDefault(require("./routes/customers"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const store_settings_1 = __importDefault(require("./routes/store-settings"));
const tickets_1 = __importDefault(require("./routes/tickets"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8080);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", async (_req, res) => {
    try {
        await (0, db_1.checkDbConnection)();
        res.json({ status: "ok" });
    }
    catch {
        res.status(500).json({ status: "error", message: "database not reachable" });
    }
});
app.use("/api/customers", customers_1.default);
app.use("/api/tickets", tickets_1.default);
app.use("/api/inquiries", inquiries_1.default);
app.use("/api/store-settings", store_settings_1.default);
app.use((error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            issues: error.issues,
        });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
});
async function bootstrap() {
    await (0, db_1.checkDbConnection)();
    app.listen(port, () => {
        console.log(`Backend listening on port ${port}`);
    });
}
bootstrap().catch(async (error) => {
    console.error("Failed to start server:", error);
    await db_1.pool.end();
    process.exit(1);
});
