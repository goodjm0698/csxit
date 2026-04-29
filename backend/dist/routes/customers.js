"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const router = (0, express_1.Router)();
const createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120),
    email: zod_1.z.string().email(),
});
router.get("/", async (_req, res, next) => {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM customers
      ORDER BY created_at DESC
      LIMIT 100;
      `);
        res.json({ items: rows });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const payload = createCustomerSchema.parse(req.body);
        const [result] = await db_1.pool.execute(`
      INSERT INTO customers (name, email)
      VALUES (?, ?);
      `, [payload.name, payload.email]);
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM customers
      WHERE id = ?;
      `, [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
