import mysql from "mysql2/promise";

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DATABASE_URL,
} = process.env;

const poolConfig = DATABASE_URL
  ? { uri: DATABASE_URL }
  : {
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 3306,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    };

export const pool = mysql.createPool({
  ...poolConfig,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export async function checkDbConnection(): Promise<void> {
  await pool.query("SELECT 1");
}
