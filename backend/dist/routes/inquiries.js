"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const gemini_1 = require("../services/gemini");
const router = (0, express_1.Router)();
const replySchema = zod_1.z.object({
    body: zod_1.z.string().trim().min(1).max(20000),
});
function parseJsonField(value) {
    if (value == null) {
        return [];
    }
    if (typeof value === "string") {
        return JSON.parse(value);
    }
    return value;
}
function parseInquiryId(value) {
    const inquiryId = Number(value);
    if (!Number.isFinite(inquiryId) || inquiryId <= 0) {
        return null;
    }
    return inquiryId;
}
function getResponseStyleLabel(value) {
    const labels = {
        friendly: "친절하고 따뜻한 톤으로, 고객이 안심할 수 있게 안내합니다.",
        formal: "정중하고 격식 있는 톤으로, 예의 바르게 안내합니다.",
        professional: "전문적이고 신뢰감 있는 톤으로, 핵심 정보를 명확하게 안내합니다.",
    };
    if (!value) {
        return labels.friendly;
    }
    return labels[value] ?? value;
}
function getLatestCustomerMessage(conversation, fallback) {
    const latestCustomerMessage = [...conversation]
        .reverse()
        .find((message) => message.type === "customer" && message.message.trim().length > 0);
    return latestCustomerMessage?.message ?? fallback;
}
async function inquiryExists(inquiryId) {
    const [rows] = await db_1.pool.query("SELECT id FROM inquiries WHERE id = ? LIMIT 1;", [inquiryId]);
    return rows.length > 0;
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
router.post("/:id/ai-draft", async (req, res, next) => {
    try {
        const inquiryId = parseInquiryId(req.params.id);
        if (!inquiryId) {
            return res.status(400).json({ message: "Invalid inquiry id" });
        }
        const [inquiryRows] = await db_1.pool.query(`
      SELECT
        id,
        channel,
        customer_name AS customerName,
        title,
        category,
        product_name AS productName,
        order_number AS orderNumber,
        conversation
      FROM inquiries
      WHERE id = ?;
      `, [inquiryId]);
        if (inquiryRows.length === 0) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        const [settingsRows] = await db_1.pool.query(`
      SELECT
        store_name AS storeName,
        response_style AS responseStyle,
        store_policy AS storePolicy
      FROM store_settings
      ORDER BY id DESC
      LIMIT 1;
      `);
        const inquiry = inquiryRows[0];
        const settings = settingsRows[0];
        const conversation = parseJsonField(inquiry.conversation);
        const aiDraft = await (0, gemini_1.generateDraftWithGemini)({
            ticketId: String(inquiry.id),
            customerMessage: getLatestCustomerMessage(conversation, inquiry.title),
            customerName: inquiry.customerName,
            productName: inquiry.productName,
            orderNumber: inquiry.orderNumber,
            category: inquiry.category,
            channel: inquiry.channel,
            storeName: settings?.storeName ?? "CS-Xit Demo Store",
            responseStyle: getResponseStyleLabel(settings?.responseStyle),
            storePolicy: settings?.storePolicy ??
                "확인되지 않은 정보는 단정하지 않고, 고객 불편에 먼저 공감하며 다음 조치를 안내합니다.",
        });
        await db_1.pool.execute(`
      UPDATE inquiries
      SET ai_draft = ?, updated_at = NOW()
      WHERE id = ?;
      `, [aiDraft, inquiryId]);
        return res.json({ aiDraft });
    }
    catch (error) {
        if (error instanceof gemini_1.GeminiConfigError) {
            return res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
        }
        if (error instanceof gemini_1.GeminiGenerationError) {
            return res.status(502).json({ message: "Failed to generate AI draft" });
        }
        next(error);
    }
});
router.get("/:id/replies", async (req, res, next) => {
    try {
        const inquiryId = parseInquiryId(req.params.id);
        if (!inquiryId) {
            return res.status(400).json({ message: "Invalid inquiry id" });
        }
        if (!(await inquiryExists(inquiryId))) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        inquiry_id AS inquiryId,
        body,
        created_at AS createdAt
      FROM inquiry_replies
      WHERE inquiry_id = ?
      ORDER BY created_at ASC, id ASC;
      `, [inquiryId]);
        return res.json({ items: rows });
    }
    catch (error) {
        next(error);
    }
});
router.post("/:id/replies", async (req, res, next) => {
    try {
        const inquiryId = parseInquiryId(req.params.id);
        if (!inquiryId) {
            return res.status(400).json({ message: "Invalid inquiry id" });
        }
        const payload = replySchema.parse(req.body);
        if (!(await inquiryExists(inquiryId))) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        const [result] = await db_1.pool.execute(`
      INSERT INTO inquiry_replies (inquiry_id, body)
      VALUES (?, ?);
      `, [inquiryId, payload.body]);
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        inquiry_id AS inquiryId,
        body,
        created_at AS createdAt
      FROM inquiry_replies
      WHERE id = ?;
      `, [result.insertId]);
        return res.status(201).json(rows[0]);
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const inquiryId = parseInquiryId(req.params.id);
        if (!inquiryId) {
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
