import { RowDataPacket } from "mysql2";

import { db } from "@/lib/db";

import { RoundTableDM } from "@/domain-models/round-table/RoundTableDM";

import { getFormattedTimestamp } from "@/utils/FormattedDate";


export class HostRoundtableRepo {
    static async getAllTables(): Promise<RoundTableDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM round_table
                ORDER BY id DESC;
            `);

            const tables: RoundTableDM[] = rows.map((row) => ({
                id: row.id,
                session_id: row.session_id,
                name: row.name,
                email: row.email,
                website: row.website,
                companyName: row.companyName,
                package: row.package,
                title: row.title,
                duration: row.duration,
                description: row.description,
                targetAudience: row.targetAudience,
                date: row.date,
                banner_image: row.banner_image,
                logo_image: row.logo_image,
                quantity: row.quantity,
                payment: row.payment,
                subscription_type: row.subscription_type,
                meta_quantity: row.meta_quantity,
                status: row.status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
            return tables;
        } catch (error) {
            console.error("Error fetching all tables:", error);
            throw new Error("Unable to fetch tables from the database");
        }
    }

    static async updateRoundtable(roundTable: RoundTableDM) {

        try {
            const currentTime = getFormattedTimestamp();
            await db.execute(
                `
                UPDATE round_table
                SET 
                status = ?, is_approved = ?, updatedAt = ?
                WHERE id = ?
            `,
                [
                    roundTable.status,
                    roundTable.is_approved,
                    currentTime,
                    roundTable.id,
                ]
            );

            return { message: "Roundtable updated successfully" };
        } catch (error) {
            console.error("Error updating Roundtable:", error);
            throw new Error("Unable to update Roundtable");
        }
    }
}
