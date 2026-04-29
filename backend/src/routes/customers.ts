import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "../db";

const router = Router();

const createCustomerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
});

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM customers
      ORDER BY created_at DESC
      LIMIT 100;
      `
    );

    res.json({ items: rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = createCustomerSchema.parse(req.body);

    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO customers (name, email)
      VALUES (?, ?);
      `,
      [payload.name, payload.email]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM customers
      WHERE id = ?;
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
