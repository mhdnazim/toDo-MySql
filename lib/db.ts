import mysql from "mysql2/promise";

function getConfig() {
  const password = process.env.DB_PASSWORD;
  if (password === undefined || password === "") {
    throw new Error(
      "DB_PASSWORD is not set. Add DB_PASSWORD=your_password to your .env file."
    );
  }
  return {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER ?? "root",
    password,
    database: process.env.DB_NAME ?? "todo_app",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(getConfig());
  }
  return pool;
}

export async function query<T = unknown>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T;
}

export default getPool;
