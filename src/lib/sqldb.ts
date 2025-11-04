// src/lib/MySqlDB.ts
import mysql from "mysql2/promise";

// Read env variables
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  throw new Error("Database environment variables are missing!");
}

// Create a connection pool
export const sqldb = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD || "",
  database: DB_NAME,
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
