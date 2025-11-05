// src/lib/MySqlDB.ts
import mysql from "mysql2/promise";

// Read env variables
const {
  DATABASE_HOST,
  DATABASE_USER,
  DB_PASSWORD,
  DATABASE_NAME
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_NAME) {
  throw new Error("Database environment variables are missing!");
}

// Create a connection pool
export const sqldb = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DB_PASSWORD || "",
  database: DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: test the connection
(async () => {
  try {
    const conn = await sqldb.getConnection();
    console.log("✅ MySQL connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
})();
