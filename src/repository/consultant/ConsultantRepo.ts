// import { db } from "@/lib/db";
// import { ResultSetHeader, RowDataPacket } from "mysql2";
// import { getFormattedTimestamp } from "@/utils/FormattedDate";
// import { ConsultantDM } from "@/domain-models/ConsultantDM";

// export class ConsultantRepo {
//     static async getAllConsultants(): Promise<ConsultantDM[]> {
//         try {
//             const [rows] = await db.query<RowDataPacket[]>(`
//                 SELECT * FROM consultants
//                 WHERE deleted_at IS NULL
//                 ORDER BY id DESC;
//                 `);

//             const consultants: ConsultantDM[] = rows.map((row) => ({
//                 id: row.id,
//                 img: row.img,
//                 name: row.name,
//                 designation: row.designation,
//                 company: row.company,
//                 overview: row.overview,
//                 email: row.email,
//                 experties_areas: row.experties_areas,
//                 engagement_models: row.engagement_models,
//                 clients: row.clients,
//                 testimonials: row.testimonials,
//                 created_at: row.created_at,
//                 updated_at: row.updated_at,
//                 deleted_at: row.deleted_at,
//             }));

//             return consultants;
//         } catch (error) {
//             console.error("Error fetching consultants:", error);
//             throw new Error("Unable to fetch consultants from the database");
//         }
//     }

//     static async AddConsultant(
//         consultant: Omit<ConsultantDM, "id" | "created_at" | "updated_at" | "deleted_at">
//     ): Promise<ConsultantDM> {
//         try {
//             const [result] = await db.execute(
//                 `INSERT INTO consultants (
//                     img,
//                     name,
//                     company,
//                     designation,
//                     overview,
//                     email,
//                     experties_areas,
//                     engagement_models,
//                     clients,
//                     testimonials
//                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     consultant.img,
//                     consultant.name,
//                     consultant.company,
//                     consultant.designation,
//                     consultant.overview,
//                     consultant.email,
//                     consultant.experties_areas,
//                     consultant.engagement_models,
//                     consultant.clients,
//                     consultant.testimonials,
//                 ]
//             ) as [ResultSetHeader, unknown];

//             const insertId = result.insertId;

//             return {
//                 id: insertId,
//                 ...consultant,
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString(),
//                 deleted_at: null,
//             };
//         } catch (error) {
//             console.error("Error inserting consultant:", error);
//             throw new Error("Failed to insert consultant");
//         }
//     }

//     static async UpdateConsultant(consultant: ConsultantDM) {
//         console.log(consultant);

//         try {
//             const currentTime = getFormattedTimestamp();

//             await db.execute(
//                 `
//                 UPDATE consultants
//                 SET 
//                     img = ?, 
//                     name = ?, 
//                     designation = ?, 
//                     company = ?, 
//                     overview = ?, 
//                     email = ?, 
//                     experties_areas = ?, 
//                     engagement_models = ?, 
//                     clients = ?, 
//                     testimonials = ?, 
//                     updated_at = ?
//                 WHERE id = ?
//                 `,
//                 [
//                     consultant.img,
//                     consultant.name,
//                     consultant.designation,
//                     consultant.company,
//                     consultant.overview,
//                     consultant.email,
//                     consultant.experties_areas,
//                     consultant.engagement_models,
//                     consultant.clients,
//                     consultant.testimonials,
//                     currentTime,
//                     consultant.id,
//                 ]
//             );

//             return { message: "Consultant updated successfully" };
//         } catch (error) {
//             console.error("Error updating consultant:", error);
//             throw new Error("Unable to update consultant");
//         }
//     }

//     static async DeleteConsultant(id: number) {
//         const currentTime = getFormattedTimestamp();

//         try {
//             await db.query(
//                 `
//                 UPDATE consultants
//                 SET deleted_at = ?
//                 WHERE id = ?
//                 `,
//                 [currentTime, id]
//             );

//             return { message: "Consultant deleted successfully" };
//         } catch (error) {
//             console.error("Error deleting consultant:", error);
//             throw new Error("Failed to delete consultant");
//         }
//     }

// }



import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { ConsultantDM } from "@/domain-models/consultant/ConsultantDM";

export class ConsultantRepo {
    static async getAllConsultants(): Promise<ConsultantDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                c.id,
                c.consultant_type_id,
                ct.value AS consultant_type_name,
                c.industry_id,
                i.value AS industry_name,
                c.location_id,
                l.value AS location_name,
                c.specialism_id,
                s.value AS specialism_name,
                c.img,
                c.name,
                c.designation,
                c.company,
                c.overview,
                c.email,
                c.experties_areas,
                c.engagement_models,
                c.clients,
                c.testimonials,
                c.created_at,
                c.updated_at,
                c.deleted_at
            FROM consultants c
            LEFT JOIN consultant_types ct ON c.consultant_type_id = ct.id
            LEFT JOIN industries i ON c.industry_id = i.id
            LEFT JOIN locations l ON c.location_id = l.id
            LEFT JOIN specialisms s ON c.specialism_id = s.id
            WHERE c.deleted_at IS NULL
            ORDER BY c.id DESC;
        `);

            const consultants: ConsultantDM[] = rows.map((row) => ({
                id: row.id,
                consultant_type_id: row.consultant_type_id,
                consultant_type_name: row.consultant_type_name,
                industry_id: row.industry_id,
                industry_name: row.industry_name,
                location_id: row.location_id,
                location_name: row.location_name,
                specialism_id: row.specialism_id,
                specialism_name: row.specialism_name,
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
                    consultant_type_id,
                    industry_id,
                    location_id,
                    specialism_id,
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    consultant.consultant_type_id,
                    consultant.industry_id,
                    consultant.location_id,
                    consultant.specialism_id,
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
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE consultants
                SET 
                    consultant_type_id = ?,
                    industry_id = ?,
                    location_id = ?,
                    specialism_id = ?,
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
                    consultant.consultant_type_id,
                    consultant.industry_id,
                    consultant.location_id,
                    consultant.specialism_id,
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
