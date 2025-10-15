import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { ProcuretechSolutionDM } from "@/domain-models/procuretech-solution/ProcuretechSolutionDM";
import { ProcuretechTypeDM } from "@/domain-models/procuretech-solution/type/ProcuretechTypeDM";

// Safe JSON stringify to avoid "undefined" binding errors
function safeJsonStringify(value: unknown): string {
    return JSON.stringify(value || []);
}

export class ProcuretechRepo {

    // Convert undefined or empty strings to null
    private static toNull(value: unknown) {
        return value === undefined || value === "" ? null : value;
    }

    static async getAllProcuretechSolutions(): Promise<ProcuretechSolutionDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                ps.id,
                ps.img,
                ps.name,
                ps.type_id,
                t.value AS type_name,
                ps.overview,
                ps.key_features,
                ps.develpment,
                ps.integration,
                ps.pricing,
                ps.recommended,
                ps.deployment_model_id,
                dm.value AS deployment_model_name,
                ps.pricing_model_id,
                pm.value AS pricing_model_name,
                ps.integration_model_id,
                im.value AS integration_model_name,
                ps.procuretech_type_id,
                pt.value AS procuretech_type_name,
                ps.created_at,
                ps.updated_at,
                ps.deleted_at
            FROM procuretech_solutions ps
            LEFT JOIN procuretech_solution_types t ON ps.type_id = t.id
            LEFT JOIN deployment_model dm ON ps.deployment_model_id = dm.id
            LEFT JOIN pricing_model pm ON ps.pricing_model_id = pm.id
            LEFT JOIN integration_model im ON ps.integration_model_id = im.id
            LEFT JOIN procuretech_solution_types pt ON ps.procuretech_type_id = pt.id
            WHERE ps.deleted_at IS NULL
            ORDER BY ps.id DESC;
        `);

            return rows.map((row) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                type_id: row.type_id,
                type_name: row.type_name,
                overview: row.overview,
                key_features: JSON.parse(row.key_features) || [],
                develpment: row.develpment || "", // plain string
                integration: row.integration || "", // plain string
                pricing: row.pricing || "", // plain string
                recommended: row.recommended || "",
                deployment_model_id: row.deployment_model_id,
                deployment_model_name: row.deployment_model_name,
                pricing_model_id: row.pricing_model_id,
                pricing_model_name: row.pricing_model_name,
                integration_model_id: row.integration_model_id,
                integration_model_name: row.integration_model_name,
                procuretech_type_id: row.type_id,
                procuretech_type_name: row.type_name,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));
        } catch (error) {
            console.error("Error fetching procuretech solutions:", error);
            throw new Error("Unable to fetch procuretech solutions from the database");
        }
    }

    // static async addProcuretechSolution(
    //     solution: Omit<ProcuretechSolutionDM, "id" | "created_at" | "updated_at" | "deleted_at">
    // ): Promise<ProcuretechSolutionDM> {
    //     try {
    //         const [result] = await db.execute(
    //             `INSERT INTO procuretech_solutions (
    //             img,
    //             name,
    //             type_id,
    //             overview,
    //             key_features,
    //             develpment,
    //             integration,
    //             pricing,
    //             recommended,
    //             deployment_model_id,
    //             pricing_model_id,
    //             integration_model_id,
    //             procuretech_type_id
    //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //             [
    //                 solution.img ?? null,
    //                 solution.name ?? null,
    //                 solution.type_id ?? null,
    //                 solution.overview ?? null,
    //                 JSON.stringify(solution.key_features || []),
    //                 solution.develpment,
    //                 solution.integration,
    //                 solution.pricing,
    //                 solution.recommended,
    //                 solution.deployment_model_id ?? null,
    //                 solution.pricing_model_id ?? null,
    //                 solution.integration_model_id ?? null,
    //                 solution.procuretech_type_id ?? null,
    //             ]
    //         ) as [ResultSetHeader, unknown];

    //         return {
    //             id: result.insertId,
    //             ...solution,
    //             created_at: new Date().toISOString(),
    //             updated_at: new Date().toISOString(),
    //             deleted_at: null,
    //         };
    //     } catch (error) {
    //         console.error("Error inserting procuretech solution:", error);
    //         throw new Error("Failed to insert procuretech solution");
    //     }
    // }

    // static async updateProcuretechSolution(solution: ProcuretechSolutionDM) {
    //     try {
    //         const currentTime = getFormattedTimestamp();

    //         await db.execute(
    //             `UPDATE procuretech_solutions
    //              SET 
    //                 img = ?,
    //                 name = ?,
    //                 type_id = ?,
    //                 overview = ?,
    //                 key_features = ?,
    //                 develpment = ?,
    //                 integration = ?,
    //                 pricing = ?,
    //                 recommended = ?,
    //                 deployment_model_id = ?,
    //                 pricing_model_id = ?,
    //                 integration_model_id = ?,
    //                 procuretech_type_id = ?,
    //                 updated_at = ?
    //              WHERE id = ?`,
    //             [
    //                 this.toNull(solution.img),
    //                 this.toNull(solution.name),
    //                 this.toNull(solution.type_id),
    //                 this.toNull(solution.overview),
    //                 this.toNull(safeJsonStringify((JSON.stringify(solution.key_features || [])))),
    //                 this.toNull(solution.develpment),
    //                 this.toNull(solution.integration),
    //                 this.toNull(solution.pricing),
    //                 this.toNull(solution.recommended),
    //                 this.toNull(solution.deployment_model_id),
    //                 this.toNull(solution.pricing_model_id),
    //                 this.toNull(solution.integration_model_id),
    //                 this.toNull(solution.procuretech_type_id),
    //                 currentTime,
    //                 this.toNull(solution.id),
    //             ]
    //         );

    //         return { message: "Procuretech solution updated successfully" };
    //     } catch (error) {
    //         console.error("Error updating procuretech solution:", error);
    //         throw new Error("Unable to update procuretech solution");
    //     }
    // }
    static async addProcuretechSolution(
        solution: Omit<ProcuretechSolutionDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<ProcuretechSolutionDM> {
        try {
            // ✅ Prevent double JSON encoding
            const keyFeaturesToSave = Array.isArray(solution.key_features)
                ? JSON.stringify(solution.key_features)
                : solution.key_features || "[]";

            const [result] = await db.execute(
                `INSERT INTO procuretech_solutions (
        img,
        name,
        type_id,
        overview,
        key_features,
        develpment,
        integration,
        pricing,
        recommended,
        deployment_model_id,
        pricing_model_id,
        integration_model_id,
        procuretech_type_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    solution.img ?? null,
                    solution.name ?? null,
                    solution.type_id ?? null,
                    solution.overview ?? null,
                    keyFeaturesToSave,
                    solution.develpment,
                    solution.integration,
                    solution.pricing,
                    solution.recommended,
                    solution.deployment_model_id ?? null,
                    solution.pricing_model_id ?? null,
                    solution.integration_model_id ?? null,
                    solution.procuretech_type_id ?? null,
                ]
            ) as [ResultSetHeader, unknown];

            return {
                id: result.insertId,
                ...solution,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            };
        } catch (error) {
            console.error("Error inserting procuretech solution:", error);
            throw new Error("Failed to insert procuretech solution");
        }
    }

    static async updateProcuretechSolution(solution: ProcuretechSolutionDM) {
        try {
            const currentTime = getFormattedTimestamp();

            // ✅ Prevent double JSON encoding
            const keyFeaturesToSave = Array.isArray(solution.key_features)
                ? JSON.stringify(solution.key_features)
                : solution.key_features || "[]";

            await db.execute(
                `UPDATE procuretech_solutions
       SET 
          img = ?,
          name = ?,
          type_id = ?,
          overview = ?,
          key_features = ?,
          develpment = ?,
          integration = ?,
          pricing = ?,
          recommended = ?,
          deployment_model_id = ?,
          pricing_model_id = ?,
          integration_model_id = ?,
          procuretech_type_id = ?,
          updated_at = ?
       WHERE id = ?`,
                [
                    this.toNull(solution.img),
                    this.toNull(solution.name),
                    this.toNull(solution.type_id),
                    this.toNull(solution.overview),
                    this.toNull(keyFeaturesToSave),
                    this.toNull(solution.develpment),
                    this.toNull(solution.integration),
                    this.toNull(solution.pricing),
                    this.toNull(solution.recommended),
                    this.toNull(solution.deployment_model_id),
                    this.toNull(solution.pricing_model_id),
                    this.toNull(solution.integration_model_id),
                    this.toNull(solution.procuretech_type_id),
                    currentTime,
                    this.toNull(solution.id),
                ]
            );

            return { message: "Procuretech solution updated successfully" };
        } catch (error) {
            console.error("Error updating procuretech solution:", error);
            throw new Error("Unable to update procuretech solution");
        }
    }


    static async deleteProcuretechSolution(id: number) {
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `UPDATE procuretech_solutions
                 SET deleted_at = ?,
                 img = NULL
                 WHERE id = ?`,
                [currentTime, id]
            );

            return { message: "Procuretech solution deleted successfully" };
        } catch (error) {
            console.error("Error deleting procuretech solution:", error);
            throw new Error("Failed to delete procuretech solution");
        }
    }

    static async getAllProcureTechtTypes(): Promise<ProcuretechTypeDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                id,
                value,
                icon,
                description,
                created_at,
                updated_at,
                deleted_at
            FROM procuretech_solution_types
            WHERE deleted_at IS NULL;
        `);

            const types: ProcuretechSolutionDM[] = rows.map((row) => ({
                id: row.id,
                value: row.value,
                icon: row.icon,
                description: row.description,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));

            return types;
        } catch (error) {
            console.error("Error fetching types:", error);
            throw new Error("Unable to fetch types from the database");
        }
    }
}
