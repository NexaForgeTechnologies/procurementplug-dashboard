import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { LegalComplianceDM } from "@/domain-models/legal-compliance/LegalComplianceDM";

// Safe JSON parser to avoid crashes
function safeJsonParse<T>(value: any, fallback: T): T {
    if (!value || typeof value !== "string") return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

// Safe JSON stringify to avoid "undefined" binding errors
function safeJsonStringify(value: any): string {
    return JSON.stringify(value || []);
}

export class LegalComplianceRepo {
    // Convert undefined or empty strings to null
    private static toNull(value: any) {
        return value === undefined || value === "" ? null : value;
    }

    static async getAllCompliance(): Promise<LegalComplianceDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT 
                    lc.id,
                    lc.legal_compliance_type_id,
                    lct.value AS legal_compliance_type_name,
                    lc.industry_id,
                    i.value AS industry_name,
                    lc.region_id,
                    r.value AS region_name,
                    lc.img,
                    lc.name,
                    lc.experties,
                    lc.overview,
                    lc.email,
                    lc.jurisdictional_coverage,
                    lc.company_logo,
                    lc.practice_areas,
                    lc.services,
                    lc.sample_templates,
                    lc.testimonials,
                    lc.created_at,
                    lc.updated_at,
                    lc.deleted_at
                FROM legal_compliance lc
                LEFT JOIN legal_compliance_types lct ON lc.legal_compliance_type_id = lct.id
                LEFT JOIN industries i ON lc.industry_id = i.id
                LEFT JOIN regions r ON lc.region_id = r.id
                WHERE lc.deleted_at IS NULL
                ORDER BY lc.id DESC;
            `);

            return rows.map((row) => ({
                id: row.id,
                legal_compliance_type_id: row.legal_compliance_type_id,
                legal_compliance_type_name: row.legal_compliance_type_name,
                industry_id: row.industry_id,
                industry_name: row.industry_name,
                region_id: row.region_id,
                region_name: row.region_name,
                img: row.img,
                name: row.name,
                experties: row.experties,
                overview: row.overview,
                email: row.email,
                jurisdictional_coverage: row.jurisdictional_coverage,
                company_logo: row.company_logo || [],
                practice_areas: row.practice_areas,
                services: row.services || [],
                sample_templates: row.sample_templates || [],
                testimonials: row.testimonials,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));
        } catch (error) {
            console.error("Error fetching legal_compliance:", error);
            throw new Error("Unable to fetch legal_compliance from the database");
        }
    }

    static async AddLegalCompliance(
        legal_compliance: Omit<LegalComplianceDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<LegalComplianceDM> {
        try {
            const [result]: any = await db.execute(
                `INSERT INTO legal_compliance (
                    legal_compliance_type_id,
                    industry_id,
                    region_id,
                    img,
                    name,
                    experties,
                    overview,
                    email,
                    jurisdictional_coverage,
                    company_logo,
                    practice_areas,
                    services,
                    sample_templates,
                    testimonials
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.toNull(legal_compliance.legal_compliance_type_id),
                    this.toNull(legal_compliance.industry_id),
                    this.toNull(legal_compliance.region_id),
                    this.toNull(legal_compliance.img),
                    this.toNull(legal_compliance.name),
                    this.toNull(legal_compliance.experties),
                    this.toNull(legal_compliance.overview),
                    this.toNull(legal_compliance.email),
                    this.toNull(legal_compliance.jurisdictional_coverage),
                    safeJsonStringify(legal_compliance.company_logo),
                    this.toNull(legal_compliance.practice_areas),
                    safeJsonStringify(legal_compliance.services),
                    safeJsonStringify(legal_compliance.sample_templates),
                    this.toNull(legal_compliance.testimonials),
                ]
            );

            return { ...legal_compliance, id: result.insertId };
        } catch (error) {
            console.error("Error inserting legal_compliance:", error);
            throw new Error("Failed to insert legal_compliance");
        }
    }

    static async UpdateLegalCompliance(legal_compliance: LegalComplianceDM) {
        try {
            const [result]: any = await db.execute(
                `UPDATE legal_compliance SET
                legal_compliance_type_id = ?,
                industry_id = ?,
                region_id = ?,
                img = ?,
                name = ?,
                experties = ?,
                overview = ?,
                email = ?,
                jurisdictional_coverage = ?,
                company_logo = ?,
                practice_areas = ?,
                services = ?,
                sample_templates = ?,
                testimonials = ?,
                updated_at = NOW()
            WHERE id = ? AND deleted_at IS NULL`,
                [
                    this.toNull(legal_compliance.legal_compliance_type_id),
                    this.toNull(legal_compliance.industry_id),
                    this.toNull(legal_compliance.region_id),
                    this.toNull(legal_compliance.img),
                    this.toNull(legal_compliance.name),
                    this.toNull(legal_compliance.experties),
                    this.toNull(legal_compliance.overview),
                    this.toNull(legal_compliance.email),
                    this.toNull(legal_compliance.jurisdictional_coverage),
                    this.toNull(safeJsonStringify(legal_compliance.company_logo)),
                    this.toNull(legal_compliance.practice_areas),
                    this.toNull(safeJsonStringify(legal_compliance.services)),
                    this.toNull(safeJsonStringify(legal_compliance.sample_templates)),
                    this.toNull(legal_compliance.testimonials),
                    this.toNull(legal_compliance.id) // wrap id too
                ]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating legal_compliance:", error);
            throw new Error("Failed to update legal_compliance");
        }
    }

    static async DeleteLegalCompliance(id: number) {
        const currentTime = getFormattedTimestamp();

        try {
            await db.query(
                `UPDATE legal_compliance
                 SET deleted_at = ?
                 WHERE id = ?`,
                [currentTime, id]
            );

            return { message: "Legal Compliance deleted successfully" };
        } catch (error) {
            console.error("Error deleting Legal Compliance:", error);
            throw new Error("Failed to delete Legal Compliance");
        }
    }
}
