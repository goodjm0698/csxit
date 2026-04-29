import os
from contextlib import closing

import pymysql
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template
from pymysql.cursors import DictCursor

load_dotenv()

app = Flask(__name__)


def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "supportdb"),
        cursorclass=DictCursor,
        autocommit=True,
        charset="utf8mb4",
    )


@app.get("/health")
def health():
    try:
        with closing(get_db_connection()) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1 AS ok")
                row = cursor.fetchone()
        return jsonify({"status": "ok", "db": row["ok"] == 1})
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500


@app.get("/api/inquiries")
def inquiries():
    query = """
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
        ORDER BY id ASC
        LIMIT 200
    """
    try:
        with closing(get_db_connection()) as conn:
            with conn.cursor() as cursor:
                cursor.execute(query)
                rows = cursor.fetchall()
        return jsonify({"items": rows})
    except Exception as exc:
        return jsonify({"message": str(exc)}), 500


@app.get("/")
def home():
    try:
        with closing(get_db_connection()) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) AS cnt FROM inquiries")
                total = cursor.fetchone()["cnt"]
                cursor.execute(
                    """
                    SELECT id, customer_name AS customerName, title, status, channel
                    FROM inquiries
                    ORDER BY id ASC
                    LIMIT 10
                    """
                )
                preview = cursor.fetchall()
    except Exception as exc:
        total = 0
        preview = []
        return render_template("index.html", total=total, preview=preview, error=str(exc)), 500

    return render_template("index.html", total=total, preview=preview, error=None)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_PORT", "5000")))
