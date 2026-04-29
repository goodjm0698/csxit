"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const router = (0, express_1.Router)();
const createTicketSchema = zod_1.z.object({
    customerId: zod_1.z.number().int().positive(),
    title: zod_1.z.string().min(1).max(120),
    description: zod_1.z.string().min(1).max(5000),
    status: zod_1.z.enum(["open", "in_progress", "closed"]).optional().default("open"),
    priority: zod_1.z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .default("medium"),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["open", "in_progress", "closed"]),
});
router.get("/", async (req, res, next) => {
    try {
        const status = typeof req.query.status === "string" ? req.query.status : undefined;
        const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
        const values = [];
        const where = [];
        if (status) {
            values.push(status);
            where.push(`t.status = ?`);
        }
        if (priority) {
            values.push(priority);
            where.push(`t.priority = ?`);
        }
        const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
        const query = `
      SELECT
        t.id,
        t.customer_id AS customerId,
        c.name AS customerName,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.created_at AS createdAt,
        t.updated_at AS updatedAt
      FROM tickets t
      JOIN customers c ON c.id = t.customer_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT 100;
    `;
        const [rows] = await db_1.pool.query(query, values);
        res.json({ items: rows });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const payload = createTicketSchema.parse(req.body);
        const [result] = await db_1.pool.execute(`
      INSERT INTO tickets (customer_id, title, description, status, priority)
      VALUES (?, ?, ?, ?, ?);
      `, [
            payload.customerId,
            payload.title,
            payload.description,
            payload.status,
            payload.priority,
        ]);
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        customer_id AS customerId,
        title,
        description,
        status,
        priority,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tickets
      WHERE id = ?;
      `, [result.insertId]);
        res.status(201).json(rows[0]);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id/status", async (req, res, next) => {
    try {
        const ticketId = Number(req.params.id);
        if (!Number.isFinite(ticketId) || ticketId <= 0) {
            return res.status(400).json({ message: "Invalid ticket id" });
        }
        const payload = updateStatusSchema.parse(req.body);
        const [result] = await db_1.pool.execute(`
      UPDATE tickets
      SET status = ?, updated_at = NOW()
      WHERE id = ?;
      `, [payload.status, ticketId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        customer_id AS customerId,
        title,
        description,
        status,
        priority,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tickets
      WHERE id = ?;
      `, [ticketId]);
        res.json(rows[0]);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
