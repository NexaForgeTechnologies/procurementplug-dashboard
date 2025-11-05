import { sqldb } from "@/lib/sqldb";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

// Domain model
export type ExclusivePartnerDM = {
  id?: number;
  logo: string;
  title: string;
  tagline: string;
  description: string;
  category_id?: number;
  website: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export class ExclusivePartnerRepo {
  // 🔹 Get all exclusive partners
  static async getAllPartners(): Promise<ExclusivePartnerDM[]> {
    try {
      const [rows] = await sqldb.query<RowDataPacket[]>(`
        SELECT 
          id,
          logo,
          title,
          tagline,
          description,
          category_id,
          website,
          created_at,
          updated_at,
          deleted_at
        FROM exclusive_business_partners
        WHERE deleted_at IS NULL
        ORDER BY id DESC;
      `);

      return rows.map((row) => ({
        id: row.id,
        logo: row.logo,
        title: row.title,
        tagline: row.tagline,
        description: row.description,
        category_id: row.category_id,
        website: row.website,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
      }));
    } catch (error) {
      console.error("Error fetching exclusive partners:", error);
      throw new Error("Unable to fetch exclusive partners from the database");
    }
  }

  // 🔹 Add new partner
  static async addPartner(
    partner: Omit<ExclusivePartnerDM, "id" | "created_at" | "updated_at" | "deleted_at">
  ): Promise<ExclusivePartnerDM> {
    try {
      const [result] = await sqldb.execute(
        `
        INSERT INTO exclusive_business_partners (
          logo,
          title,
          tagline,
          description,
          category_id,
          website
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          partner.logo,
          partner.title,
          partner.tagline,
          partner.description,
          partner.category_id || null,
          partner.website,
        ]
      ) as [ResultSetHeader, unknown];

      return {
        id: result.insertId,
        ...partner,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error inserting exclusive partner:", error);
      throw new Error("Failed to insert exclusive partner");
    }
  }

  // 🔹 Update partner
  static async updatePartner(partner: ExclusivePartnerDM) {
    try {
      await sqldb.execute(
        `
        UPDATE exclusive_business_partners
        SET 
          logo = ?,
          title = ?,
          tagline = ?,
          description = ?,
          category_id = ?,
          website = ?,
          updated_at = ?
        WHERE id = ?
      `,
        [
          partner.logo,
          partner.title,
          partner.tagline,
          partner.description,
          partner.category_id || null,
          partner.website,
          getFormattedTimestamp(), // directly call instead of storing in a variable
          partner.id,
        ]
      );

      return { message: "Exclusive partner updated successfully" };
    } catch (error) {
      console.error("Error updating exclusive partner:", error);
      throw new Error("Unable to update exclusive partner");
    }
  }

  // 🔹 Delete partner (soft delete)
  static async deletePartner(id: number) {
    try {
      await sqldb.query(
        `DELETE FROM exclusive_business_partners WHERE id = ?`,
        [id]
      );
      return { message: "Exclusive partner deleted successfully" };
    } catch (error) {
      console.error("Error deleting exclusive partner:", error);
      throw new Error("Failed to delete exclusive partner");
    }
  }
}
