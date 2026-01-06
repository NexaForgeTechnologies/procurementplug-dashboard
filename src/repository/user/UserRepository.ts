import { db } from "@/lib/db";
import { UsersDM } from "@/domain-models/user/UsersDM";
import { RowDataPacket } from "mysql2";

export class UserRepository {

  static async getUserByEmail(email: string): Promise<UsersDM | null> {
    try {
      // const [rows] = await db.query<RowDataPacket[]>(
      //   "SELECT * FROM users WHERE email = ?",
      //   [email]
      // );
      await db.query("SELECT 1");

      const [rows] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (rows.length > 0) {
        const row = rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user by email");
    }
  }

}
