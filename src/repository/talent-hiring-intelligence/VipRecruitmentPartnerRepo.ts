// /repositories/VipRecruitmentPartnerRepo.ts
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// Domain model
export type VipRecruitmentPartnerDM = {
    id?: number;
    company_logo?: string;
    company_name?: string;
    company_about?: string;
    company_email?: string;
    website_url?: string;
};

export class VipRecruitmentPartnerRepo {

    // 🔹 Get all partners
    static async getAllPartners(): Promise<VipRecruitmentPartnerDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT
                    id,
                    company_logo,
                    company_name,
                    company_about,
                    company_email,
                    website_url
                FROM vip_recruitment_partners
                ORDER BY id DESC;
            `);

            return rows.map((row) => ({
                id: row.id,
                company_logo: row.company_logo,
                company_name: row.company_name,
                company_about: row.company_about,
                company_email: row.company_email,
                website_url: row.website_url,
            }));
        } catch (error) {
            console.error("Error fetching VIP recruitment partners:", error);
            throw new Error("Unable to fetch VIP recruitment partners from the database");
        }
    }

    // 🔹 Add new partner
    static async addPartner(
        partner: Omit<VipRecruitmentPartnerDM, "id">
    ): Promise<VipRecruitmentPartnerDM> {
        try {
            const [result] = await db.execute(
                `
                INSERT INTO vip_recruitment_partners (
                    company_logo,
                    company_name,
                    company_about,
                    company_email,
                    website_url
                ) VALUES (?, ?, ?, ?, ?)
                `,
                [
                    partner.company_logo || null,
                    partner.company_name,
                    partner.company_about || null,
                    partner.company_email || null,
                    partner.website_url || null,
                ]
            ) as [ResultSetHeader, unknown];

            return {
                id: result.insertId,
                ...partner,
            };
        } catch (error) {
            console.error("Error inserting VIP recruitment partner:", error);
            throw new Error("Failed to insert VIP recruitment partner");
        }
    }

    // 🔹 Update partner
    static async updatePartner(partner: VipRecruitmentPartnerDM) {
        try {
            await db.execute(
                `
                UPDATE vip_recruitment_partners
                SET
                    company_logo = ?,
                    company_name = ?, 
                    company_about = ?,
                    company_email = ?,
                    website_url = ?
                WHERE id = ?
                `,
                [
                    partner.company_logo || null,
                    partner.company_name,
                    partner.company_about || null,
                    partner.company_email || null,
                    partner.website_url || null,
                    partner.id,
                ]
            );

            return { message: "VIP recruitment partner updated successfully" };
        } catch (error) {
            console.error("Error updating VIP recruitment partner:", error);
            throw new Error("Unable to update VIP recruitment partner");
        }
    }

    // 🔹 Delete partner
    static async deletePartner(id: number) {
        try {
            await db.query(
                `DELETE FROM vip_recruitment_partners WHERE id = ?`,
                [id]
            );
            return { message: "VIP recruitment partner deleted successfully" };
        } catch (error) {
            console.error("Error deleting VIP recruitment partner:", error);
            throw new Error("Failed to delete VIP recruitment partner");
        }
    }
}
