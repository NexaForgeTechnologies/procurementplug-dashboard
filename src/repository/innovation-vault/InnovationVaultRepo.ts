import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

// Domain model
export type InnovationVaultDM = {
    id?: number;
    logo: string;
    title: string;
    category_id?: number;
    description: string;
    keyFeatures: string[]; // stored as JSON
    relatedTools: string[]; // <-- added
    categoryDescription: string;
    sponsoredBy: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
};

export class InnovationVaultRepo {
    // 🔹 Get all innovations
    static async getAllInnovations(): Promise<InnovationVaultDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT 
                    id,
                    logo,
                    title,
                    category_id,
                    description,
                    key_features,
                    related_tools,        -- <-- added
                    category_description,
                    sponsored_by,
                    created_at,
                    updated_at,
                    deleted_at
                FROM innovation_vault
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
            `);

            return rows.map((row) => {
                let parsedKeyFeatures: string[] = [];
                let parsedRelatedTools: string[] = [];

                try {
                    parsedKeyFeatures =
                        row.key_features && typeof row.key_features === "string"
                            ? JSON.parse(row.key_features)
                            : [];
                } catch {
                    console.warn(`⚠️ Invalid JSON in key_features for innovation id=${row.id}:`, row.key_features);
                }

                try {
                    parsedRelatedTools =
                        row.related_tools && typeof row.related_tools === "string"
                            ? JSON.parse(row.related_tools)
                            : [];
                } catch {
                    console.warn(`⚠️ Invalid JSON in related_tools for innovation id=${row.id}:`, row.related_tools);
                }

                return {
                    id: row.id,
                    logo: row.logo,
                    title: row.title,
                    category_id: row.category_id,
                    description: row.description,
                    keyFeatures: parsedKeyFeatures,
                    relatedTools: parsedRelatedTools,  // <-- added
                    categoryDescription: row.category_description,
                    sponsoredBy: row.sponsored_by,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    deleted_at: row.deleted_at,
                };
            });
        } catch (error) {
            console.error("Error fetching innovations from DB:", error);
            throw new Error("Unable to fetch innovations from the database");
        }
    }

    // 🔹 Add new innovation
    static async addInnovation(
        innovation: Omit<InnovationVaultDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<InnovationVaultDM> {
        try {
            const [result] = await db.execute(
                `
                INSERT INTO innovation_vault (
                    logo,
                    title,
                    category_id,
                    description,
                    key_features,
                    related_tools,             -- <-- added
                    category_description,
                    sponsored_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    innovation.logo,
                    innovation.title,
                    innovation.category_id || null,
                    innovation.description,
                    JSON.stringify(innovation.keyFeatures || []),
                    JSON.stringify(innovation.relatedTools || []),  // <-- added
                    innovation.categoryDescription,
                    innovation.sponsoredBy,
                ]
            ) as [ResultSetHeader, unknown];

            return {
                id: result.insertId,
                ...innovation,
                created_at: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error inserting innovation:", error);
            throw new Error("Failed to insert innovation");
        }
    }

    // 🔹 Update innovation
    static async updateInnovation(innovation: InnovationVaultDM) {
        try {
            await db.execute(
                `
                UPDATE innovation_vault
                SET 
                    logo = ?,
                    title = ?,
                    category_id = ?,
                    description = ?,
                    key_features = ?,
                    related_tools = ?,           -- <-- added
                    category_description = ?,
                    sponsored_by = ?,
                    updated_at = ?
                WHERE id = ?
                `,
                [
                    innovation.logo,
                    innovation.title,
                    innovation.category_id || null,
                    innovation.description,
                    JSON.stringify(innovation.keyFeatures || []),
                    JSON.stringify(innovation.relatedTools || []),  // <-- added
                    innovation.categoryDescription,
                    innovation.sponsoredBy,
                    getFormattedTimestamp(),
                    innovation.id,
                ]
            );

            return { message: "Innovation updated successfully" };
        } catch (error) {
            console.error("Error updating innovation:", error);
            throw new Error("Unable to update innovation");
        }
    }

    // 🔹 Delete innovation (soft delete)
    static async deleteInnovation(id: number) {
        try {
            await db.execute(
                `UPDATE innovation_vault SET deleted_at = ? WHERE id = ?`,
                [getFormattedTimestamp(), id]
            );

            return { message: "Innovation deleted successfully" };
        } catch (error) {
            console.error("Error deleting innovation:", error);
            throw new Error("Failed to delete innovation");
        }
    }
}
