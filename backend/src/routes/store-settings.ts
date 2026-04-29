import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../db";

const router = Router();

const responseStyles = ["friendly", "formal", "professional"] as const;

const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(1).max(120),
  websiteUrl: z.string().trim().url().max(255),
  channels: z.array(z.string().trim().min(1)).min(1),
  responseStyle: z.enum(responseStyles),
  storePolicy: z.string().trim().min(1).max(20000),
});

function parseChannels(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      return [];
    }
  }

  return [];
}

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
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
      `
    );

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
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = storeSettingsSchema.parse(req.body);

    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO store_settings (
        store_name,
        website_url,
        channels,
        response_style,
        store_policy
      ) VALUES (?, ?, ?, ?, ?);
      `,
      [
        payload.storeName,
        payload.websiteUrl,
        JSON.stringify(payload.channels),
        payload.responseStyle,
        payload.storePolicy,
      ]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      `
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
      `,
      [result.insertId]
    );

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
  } catch (error) {
    next(error);
  }
});

export default router;
