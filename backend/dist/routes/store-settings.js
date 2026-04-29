"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const router = (0, express_1.Router)();
const responseStyles = ["friendly", "formal", "professional"];
const storeSettingsSchema = zod_1.z.object({
    storeName: zod_1.z.string().trim().min(1).max(120),
    websiteUrl: zod_1.z.string().trim().url().max(255),
    channels: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1),
    responseStyle: zod_1.z.enum(responseStyles),
    storePolicy: zod_1.z.string().trim().min(1).max(20000),
});
function parseChannels(value) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item));
    }
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item));
            }
        }
        catch {
            return [];
        }
    }
    return [];
}
router.get("/", async (_req, res, next) => {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        store_name AS storeName,
        website_url AS websiteUrl,
        channels,
        response_style AS responseStyle,
        store_policy AS storePolicy,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM store_settings
      ORDER BY id DESC
      LIMIT 1;
      `);
        if (rows.length === 0) {
            return res.json({ item: null });
        }
        const row = rows[0];
        return res.json({
            item: {
                id: row.id,
                storeName: row.storeName,
                websiteUrl: row.websiteUrl,
                channels: parseChannels(row.channels),
                responseStyle: row.responseStyle,
                storePolicy: row.storePolicy,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const payload = storeSettingsSchema.parse(req.body);
        const [result] = await db_1.pool.execute(`
      INSERT INTO store_settings (
        store_name,
        website_url,
        channels,
        response_style,
        store_policy
      ) VALUES (?, ?, ?, ?, ?);
      `, [
            payload.storeName,
            payload.websiteUrl,
            JSON.stringify(payload.channels),
            payload.responseStyle,
            payload.storePolicy,
        ]);
        const [rows] = await db_1.pool.query(`
      SELECT
        id,
        store_name AS storeName,
        website_url AS websiteUrl,
        channels,
        response_style AS responseStyle,
        store_policy AS storePolicy,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM store_settings
      WHERE id = ?;
      `, [result.insertId]);
        const row = rows[0];
        return res.status(201).json({
            id: row.id,
            storeName: row.storeName,
            websiteUrl: row.websiteUrl,
            channels: parseChannels(row.channels),
            responseStyle: row.responseStyle,
            storePolicy: row.storePolicy,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
