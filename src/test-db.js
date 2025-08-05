const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-1234.hostinger.com",
      user: "u901234396_procurement",
      password: "iGq[&s+9",
      database: "u901234396_procurement",
    });
    console.log("Connected to database!");
    const [rows] = await connection.query("SELECT 1 + 1 AS solution");
    console.log("Test query result:", rows);
    await connection.end();
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();
