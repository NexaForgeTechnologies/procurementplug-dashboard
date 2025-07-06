import { EventDM } from "@/domain-models/EventDm";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

export class EventRepo {
    static async getAllEvents(): Promise<EventDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM events
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
            `);

            const event: EventDM[] = rows.map((row: any) => ({
                id: row.id,
                event_name: row.event_name,
                event_date: row.event_date,
                collaboration: row.collaboration,
                event_heading: row.event_heading,
                event_detail: row.event_detail,
                event_date_time: row.event_date_time,
                event_location: row.event_location,
                event_designedfor: row.event_designedfor,
                event_ticket: row.event_ticket,
                event_booking_url: row.event_booking_url,
                speakers_ids: row.speakers_ids,
                speakers_names: row.speakers_names,

            }));
            return event;
        } catch (error) {
            console.error("Error fetching all event:", error);
            throw new Error("Unable to fetch event from the database");
        }
    }

    static async AddEvent(event: Omit<EventDM, "id">): Promise<EventDM> {
        try {
            const [result]: any = await db.execute(
                `INSERT INTO event ()
                VALUES ()`,
                [
                ]
            );

            const insertId = result.insertId;

            return { id: insertId, ...event };
        } catch (error) {
            console.error("Error inserting event:", error);
            throw new Error("Failed to insert event");
        }
    }

    static async UpdateEvent(event: EventDM) {
        try {
            const currentTime = getFormattedTimestamp();
            await db.execute(
                `
                UPDATE events
                SET 
                event_name =?, updated_at = ?
                WHERE id = ?
            `,
                [
                    event.event_name,
                    currentTime,
                    event.id,
                ]
            );

            return { message: "Event updated successfully" };
        } catch (error) {
            console.error("Error updating Event:", error);
            throw new Error("Unable to update Event");
        }
    }

    static async DeleteEvent(id: EventDM) {
        const currentTime = getFormattedTimestamp();
        console.log(id);

        try {
            await db.query(
                `UPDATE events
                    SET 
                        deleted_at = ? 
                    WHERE id = ?;`,
                [currentTime, id]
            );
        } catch (error) {
            console.error("Error deleting event:", error);
            throw new Error("Failed to delete event");
        }
    }
}
