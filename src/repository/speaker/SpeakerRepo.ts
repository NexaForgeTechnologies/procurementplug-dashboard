import { SpeakerDM } from "@/domain-models/speaker/SpeakerDM";
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

export class SpeakerRepo {
    static async getAllSpeakers(): Promise<SpeakerDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM speakers
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
            `);

            const speakers: SpeakerDM[] = rows.map((row) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                designation: row.designation,
                company: row.company,
                role: row.role,
                bg_color: row.bg_color
            }));
            return speakers;
        } catch (error) {
            console.error("Error fetching all speakers:", error);
            throw new Error("Unable to fetch speakers from the database");
        }
    }

    static async AddSpeaker(speaker: Omit<SpeakerDM, "id">): Promise<SpeakerDM> {
        try {
            const [result] = await db.execute(
                `INSERT INTO speakers (name, img, designation, company)
   VALUES (?, ?, ?, ?)`,
                [speaker.name, speaker.img, speaker.designation, speaker.company]
            ) as [ResultSetHeader, unknown];

            const insertId = result.insertId;

            //     const [result]: unknown = await db.execute(
            //         `INSERT INTO speakers (name, img, designation, company)
            //  VALUES (?, ?, ?, ?)`,
            //         [
            //             speaker.name,
            //             speaker.img,
            //             speaker.designation,
            //             speaker.company,
            //         ]
            //     );

            // const insertId = result.insertId;

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
                img = ?, name = ?, designation = ?, company = ?, updated_at = ?
                WHERE id = ?
            `,
                [
                    speaker.img,
                    speaker.name,
                    speaker.designation,
                    speaker.company,
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
