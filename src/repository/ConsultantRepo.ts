import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { ConsultantDM } from "@/domain-models/ConsultantDM";

export class ConsultantRepo {
    static async getAllConsultants(): Promise<ConsultantDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
      SELECT * FROM consultants
      WHERE deleted_at IS NULL
      ORDER BY id DESC;
    `);

            const consultants: ConsultantDM[] = rows.map((row) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                designation: row.designation,
                company: row.company,
                overview: row.overview,
                email: row.email,
                experties_areas: row.experties_areas,
                engagement_models: row.engagement_models,
                clients: row.clients,
                testimonials: row.testimonials,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));

            return consultants;
        } catch (error) {
            console.error("Error fetching consultants:", error);
            throw new Error("Unable to fetch consultants from the database");
        }
    }

    static async AddConsultant(
        consultant: Omit<ConsultantDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<ConsultantDM> {
        try {
            const [result] = await db.execute(
                `INSERT INTO consultants (
        img,
        name,
        company,
        designation,
        overview,
        email,
        experties_areas,
        engagement_models,
        clients,
        testimonials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    consultant.img,
                    consultant.name,
                    consultant.company,
                    consultant.designation,
                    consultant.overview,
                    consultant.email,
                    consultant.experties_areas,
                    consultant.engagement_models,
                    consultant.clients,
                    consultant.testimonials,
                ]
            ) as [ResultSetHeader, unknown];

            const insertId = result.insertId;

            return {
                id: insertId,
                ...consultant,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            };
        } catch (error) {
            console.error("Error inserting consultant:", error);
            throw new Error("Failed to insert consultant");
        }
    }

    static async UpdateConsultant(consultant: ConsultantDM) {
        console.log(consultant);
        
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE consultants
                SET 
                    img = ?, 
                    name = ?, 
                    designation = ?, 
                    company = ?, 
                    overview = ?, 
                    email = ?, 
                    experties_areas = ?, 
                    engagement_models = ?, 
                    clients = ?, 
                    testimonials = ?, 
                    updated_at = ?
                WHERE id = ?
                `,
                [
                    consultant.img,
                    consultant.name,
                    consultant.designation,
                    consultant.company,
                    consultant.overview,
                    consultant.email,
                    consultant.experties_areas,
                    consultant.engagement_models,
                    consultant.clients,
                    consultant.testimonials,
                    currentTime,
                    consultant.id,
                ]
            );

            return { message: "Consultant updated successfully" };
        } catch (error) {
            console.error("Error updating consultant:", error);
            throw new Error("Unable to update consultant");
        }
    }

    static async DeleteConsultant(id: number) {
        const currentTime = getFormattedTimestamp();

        try {
            await db.query(
                `
      UPDATE consultants
      SET deleted_at = ?
      WHERE id = ?
    `,
                [currentTime, id]
            );

            return { message: "Consultant deleted successfully" };
        } catch (error) {
            console.error("Error deleting consultant:", error);
            throw new Error("Failed to delete consultant");
        }
    }

}
