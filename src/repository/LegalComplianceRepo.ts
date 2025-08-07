import { db } from "@/lib/db";

import { ResultSetHeader, RowDataPacket } from "mysql2";

import { getFormattedTimestamp } from "@/utils/FormattedDate";

import { LegalComplianceDM } from "@/domain-models/LegalComplianceDM";

export class LegalComplianceRepo {
    static async getAllCompliance(): Promise<LegalComplianceDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM legal_compliance
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
                `);

            const legal_compliance: LegalComplianceDM[] = rows.map((row) => ({
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

            return legal_compliance;
        } catch (error) {
            console.error("Error fetching legal_compliance:", error);
            throw new Error("Unable to fetch legal_compliance from the database");
        }
    }

    static async AddLegalCompliance(
        legal_compliance: Omit<LegalComplianceDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<LegalComplianceDM> {
        try {
            const [result] = await db.execute(
                `INSERT INTO legal_compliance (
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
                    legal_compliance.img,
                    legal_compliance.name,
                    legal_compliance.company,
                    legal_compliance.designation,
                    legal_compliance.overview,
                    legal_compliance.email,
                    legal_compliance.experties_areas,
                    legal_compliance.engagement_models,
                    legal_compliance.clients,
                    legal_compliance.testimonials,
                ]
            ) as [ResultSetHeader, unknown];

            const insertId = result.insertId;

            return {
                id: insertId,
                ...legal_compliance,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            };
        } catch (error) {
            console.error("Error inserting legal_compliance:", error);
            throw new Error("Failed to insert legal_compliance");
        }
    }

    static async UpdateLegalCompliance(legal_compliance: LegalComplianceDM) {

        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE legal_compliance
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
                    legal_compliance.img,
                    legal_compliance.name,
                    legal_compliance.designation,
                    legal_compliance.company,
                    legal_compliance.overview,
                    legal_compliance.email,
                    legal_compliance.experties_areas,
                    legal_compliance.engagement_models,
                    legal_compliance.clients,
                    legal_compliance.testimonials,
                    currentTime,
                    legal_compliance.id,
                ]
            );

            return { message: "Legal Compliance updated successfully" };
        } catch (error) {
            console.error("Error updating Legal Compliance:", error);
            throw new Error("Unable to update Legal Compliance");
        }
    }

    static async DeleteLegalCompliance(id: number) {
        const currentTime = getFormattedTimestamp();

        try {
            await db.query(
                `
                UPDATE legal_compliance
                SET deleted_at = ?
                WHERE id = ?
                `,
                [currentTime, id]
            );

            return { message: "Legal  Compliance deleted successfully" };
        } catch (error) {
            console.error("Error deleting Legal  Compliance:", error);
            throw new Error("Failed to delete Legal  Compliance");
        }
    }

}
