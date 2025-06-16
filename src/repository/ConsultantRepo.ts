import { ConsultantDM } from "@/domain-models/ConsultantDM";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

export class ConsultantRepo {
    static async getAllConsultant(): Promise<ConsultantDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
        SELECT * FROM consultants
        WHERE deleted_at IS NULL;
      `);

            const consultants: ConsultantDM[] = rows.map((row: any) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                role: row.role,
                designation: row.designation,
                company: row.company,
                bg_color: row.bg_color,
                industry_id: row.industry_id,
                location: row.location,
                specialism_id: row.company,
            }));
            return consultants;
        } catch (error) {
            console.error("Error fetching all consultants:", error);
            throw new Error("Unable to fetch consultants from the database");
        }
    }
}
