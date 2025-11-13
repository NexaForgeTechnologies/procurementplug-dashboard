import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

// Domain model
export type TalentHiringDM = {
    id?: number;
    name: string;
    occupation: string;
    address: string;
    description?: string;
    logo?: string;              // <-- added logo field
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
};

export class TalentHiringIntelligenceRepo {
    // 🔹 Get all talents
    static async getAllTalents(): Promise<TalentHiringDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
        SELECT
          id,
          name,
          occupation,
          address,
          description,
          logo,                -- added here
          created_at,
          updated_at,
          deleted_at
        FROM talent_hiring_intelligence
        WHERE deleted_at IS NULL
        ORDER BY id DESC;
      `);

            return rows.map((row) => ({
                id: row.id,
                name: row.name,
                occupation: row.occupation,
                address: row.address,
                description: row.description,
                logo: row.logo,       // added here
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));
        } catch (error) {
            console.error("Error fetching talents:", error);
            throw new Error("Unable to fetch talent records from the database");
        }
    }

    // 🔹 Add new talent
    static async addTalent(
        talent: Omit<TalentHiringDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<TalentHiringDM> {
        try {
            const [result] = await db.execute(
                `
        INSERT INTO talent_hiring_intelligence (
          name,
          logo,
          occupation,
          address,
          description,
        ) VALUES (?, ?, ?, ?, ?)
      `,
                [
                    talent.name,
                    talent.logo || null,
                    talent.occupation,
                    talent.address,
                    talent.description || null,
                    // handle optional logo
                ]
            ) as [ResultSetHeader, unknown];

            return {
                id: result.insertId,
                ...talent,
                created_at: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error inserting talent:", error);
            throw new Error("Failed to insert talent record");
        }
    }

    // 🔹 Update talent
    static async updateTalent(talent: TalentHiringDM) {
        try {
            await db.execute(
                `
        UPDATE talent_hiring_intelligence
        SET
          name = ?,
          logo = ?, 
          occupation = ?,
          address = ?,
          description = ?,    
          updated_at = ?
        WHERE id = ?
      `,
                [
                    talent.name,
                    talent.logo || null,
                    talent.occupation,
                    talent.address,
                    talent.description || null,
                    getFormattedTimestamp(),
                    talent.id,
                ]
            );

            return { message: "Talent updated successfully" };
        } catch (error) {
            console.error("Error updating talent:", error);
            throw new Error("Unable to update talent record");
        }
    }

    // 🔹 Delete talent (hard delete)
    static async deleteTalent(id: number) {
        try {
            await db.query(
                `DELETE FROM talent_hiring_intelligence WHERE id = ?`,
                [id]
            );
            return { message: "Talent deleted successfully" };
        } catch (error) {
            console.error("Error deleting talent:", error);
            throw new Error("Failed to delete talent record");
        }
    }
}
