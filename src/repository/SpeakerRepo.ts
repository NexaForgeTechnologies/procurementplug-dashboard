import { SpeakerDM } from "@/domain-models/SpeakerDM";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

export class SpeakerRepo {
    static async getAllSpeakers(): Promise<SpeakerDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM speakers
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
            `);

            const speakers: SpeakerDM[] = rows.map((row: any) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                role: row.role,
                designation: row.designation,
                company: row.company,
                bg_color: row.bg_color,
            }));
            return speakers;
        } catch (error) {
            console.error("Error fetching all speakers:", error);
            throw new Error("Unable to fetch speakers from the database");
        }
    }

    static async AddSpeaker(speaker: Omit<SpeakerDM, "id">): Promise<SpeakerDM> {
        try {
            const [result]: any = await db.execute(
                `INSERT INTO speakers (name, img, role, designation, company, bg_color)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    speaker.name,
                    speaker.img,
                    speaker.role,
                    speaker.designation,
                    speaker.company,
                    speaker.bg_color,
                ]
            );

            const insertId = result.insertId;

            return { id: insertId, ...speaker };
        } catch (error) {
            console.error("Error inserting speaker:", error);
            throw new Error("Failed to insert speaker");
        }
    }

    static async UpdateSpeaker(speaker: SpeakerDM) {
        try {
            const currentTime = getFormattedTimestamp();
            await db.execute(
                `
                UPDATE speakers
                SET 
                img = ?, name = ?, role = ?,  designation = ? , company = ?, bg_color = ?, updated_at = ?
                WHERE id = ?
            `,
                [
                    speaker.img,
                    speaker.name,
                    speaker.role,
                    speaker.designation,
                    speaker.company,
                    speaker.bg_color,
                    currentTime,
                    speaker.id,
                ]
            );

            return { message: "Speaker updated successfully" };
        } catch (error) {
            console.error("Error updating Speaker:", error);
            throw new Error("Unable to update Speaker");
        }
    }

    static async DeleteSpeaker(id: SpeakerDM) {
        const currentTime = getFormattedTimestamp();
        console.log(id);

        try {
            await db.query(
                `UPDATE speakers
                    SET 
                        deleted_at = ? 
                    WHERE id = ?;`,
                [currentTime, id]
            );
        } catch (error) {
            console.error("Error deleting speaker:", error);
            throw new Error("Failed to delete speaker");
        }
    }
}
