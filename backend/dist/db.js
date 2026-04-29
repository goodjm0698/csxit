"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.checkDbConnection = checkDbConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DATABASE_URL, } = process.env;
const poolConfig = DATABASE_URL
    ? { uri: DATABASE_URL }
    : {
        host: DB_HOST,
        port: DB_PORT ? Number(DB_PORT) : 3306,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,
    };
exports.pool = promise_1.default.createPool({
    ...poolConfig,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
});
async function checkDbConnection() {
    await exports.pool.query("SELECT 1");
}
