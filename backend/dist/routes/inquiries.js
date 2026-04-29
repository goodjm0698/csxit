"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
function parseJsonField(value) {
    if (value == null) {
        return [];
    }
    if (typeof value === "string") {
        return JSON.parse(value);
    }
    return value;
}
router.get("/", async (_req, res, next) => {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        channel,
        customer_name AS customerName,
        title,
        status,
        elapsed_time AS elapsedTime,
        category,
        product_name AS productName,
        order_number AS orderNumber,
        ticket_number AS ticketNumber,
        wait_time AS waitTime,
        customer_initial AS customerInitial,
        customer_tier AS customerTier,
        member_id AS memberId,
        phone,
        email,
        joined_at AS joinedAt,
        total_spent AS totalSpent,
        total_orders AS totalOrders
      FROM inquiries
      ORDER BY id ASC;
      `);
        res.json({ items: rows });
    }
    catch (error) {
        next(error);
    }
});
router.get("/metrics", async (_req, res, next) => {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT status, COUNT(*) AS count
      FROM inquiries
      GROUP BY status;
      `);
        const metrics = {
            new: 0,
            progress: 0,
            waiting: 0,
            complete: 0,
        };
        for (const row of rows) {
            const status = row.status;
            if (status in metrics) {
                metrics[status] = Number(row.count);
            }
        }
        res.json(metrics);
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const inquiryId = Number(req.params.id);
        if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
            return res.status(400).json({ message: "Invalid inquiry id" });
        }
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        channel,
        customer_name AS customerName,
        title,
        status,
        elapsed_time AS elapsedTime,
        category,
        product_name AS productName,
        order_number AS orderNumber,
        ticket_number AS ticketNumber,
        wait_time AS waitTime,
        customer_initial AS customerInitial,
        customer_tier AS customerTier,
        member_id AS memberId,
        phone,
        email,
        joined_at AS joinedAt,
        total_spent AS totalSpent,
        total_orders AS totalOrders,
        purchase_history AS purchaseHistory,
        consult_history AS consultHistory,
        conversation,
        ai_draft AS aiDraft
      FROM inquiries
      WHERE id = ?;
      `, [inquiryId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        const row = rows[0];
        res.json({
            id: String(row.id),
            channel: row.channel,
            customerName: row.customerName,
            title: row.title,
            status: row.status,
            elapsedTime: row.elapsedTime,
            category: row.category,
            productName: row.productName,
            orderNumber: row.orderNumber,
            ticketNumber: row.ticketNumber,
            waitTime: row.waitTime,
            customerInitial: row.customerInitial,
            customerTier: row.customerTier,
            memberId: row.memberId,
            phone: row.phone,
            email: row.email,
            joinedAt: row.joinedAt,
            totalSpent: row.totalSpent,
            totalOrders: row.totalOrders,
            purchaseHistory: parseJsonField(row.purchaseHistory),
            consultHistory: parseJsonField(row.consultHistory),
            conversation: parseJsonField(row.conversation),
            aiDraft: row.aiDraft,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
