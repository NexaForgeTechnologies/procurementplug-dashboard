import { EventDM } from "@/domain-models/EventDm";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";

import { ResultSetHeader } from "mysql2";

export class EventRepo {
    static async getAllEvents(): Promise<EventDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM event
                WHERE deleted_at IS NULL
                ORDER BY id DESC;
            `);

            // const event: EventDM[] = rows.map((row) => ({
            //     id: row.id,
            //     event_name: row.event_name,
            //     event_date: row.event_date,
            //     collaboration: row.collaboration,
            //     event_heading: row.event_heading,
            //     heading_detail: row.heading_detail,
            //     event_date_time: row.event_date_time,
            //     event_location: row.event_location,
            //     event_designedfor: row.event_designedfor,
            //     event_ticket: row.event_ticket,
            //     event_booking_url: row.event_booking_url,
            //     workshops: row.workshops,
            //     agenda: row.agenda,
            //     speakers_heading: row.speakers_heading,
            //     speakers: row.speakers,
            //     event_highlight_detail: row.event_highlight_detail,
            //     event_highlight_img: row.event_highlight_img,
            //     hightlight_heading: row.hightlight_heading,
            //     hightlight_subheading_1: row.hightlight_subheading_1,
            //     hightlight_subdetail_1: row.hightlight_subdetail_1,
            //     hightlight_subheading_2: row.hightlight_subheading_2,
            //     hightlight_subdetail_2: row.hightlight_subdetail_2,
            // }));
            const event = rows as EventDM[];
            return event;
        } catch (error) {
            console.error("Error fetching all event:", error);
            throw new Error("Unable to fetch event from the database");
        }
    }

    // static async AddEvent(event: Omit<EventDM, "id">): Promise<EventDM> {
    //     try {
    //         // Convert undefined to null to avoid MySQL error
    //         const sanitize = <T>(value: T | undefined): T | null =>
    //             value === undefined ? null : value;

    //         const [result]: EventDM = await db.execute(
    //             `INSERT INTO event (
    //             event_name,
    //             event_date,
    //             collaboration,
    //             event_heading,
    //             heading_detail,
    //             event_date_time,
    //             event_location,
    //             event_designedfor,
    //             event_ticket,
    //             event_booking_url,
    //             workshops,
    //             agenda,
    //             speakers_heading,
    //             speakers,
    //             event_highlight_detail,
    //             event_highlight_img,
    //             hightlight_heading,
    //             hightlight_subheading_1,
    //             hightlight_subdetail_1,
    //             hightlight_subheading_2,
    //             hightlight_subdetail_2
    //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //             [
    //                 sanitize(event.event_name),
    //                 sanitize(event.event_date),
    //                 sanitize(JSON.stringify(event.collaboration)),
    //                 sanitize(event.event_heading),
    //                 sanitize(event.heading_detail),
    //                 sanitize(event.event_date_time),
    //                 sanitize(event.event_location),
    //                 sanitize(event.event_designedfor),
    //                 sanitize(event.event_ticket),
    //                 sanitize(event.event_booking_url),
    //                 sanitize(JSON.stringify(event.workshops)),
    //                 sanitize(event.agenda),
    //                 sanitize(event.speakers_heading),
    //                 sanitize(JSON.stringify(event.speakers)),
    //                 sanitize(event.event_highlight_detail),
    //                 sanitize(JSON.stringify(event.event_highlight_img)),
    //                 sanitize(event.hightlight_heading),
    //                 sanitize(event.hightlight_subheading_1),
    //                 sanitize(event.hightlight_subdetail_1),
    //                 sanitize(event.hightlight_subheading_2),
    //                 sanitize(event.hightlight_subdetail_2),
    //             ]
    //         );

    //         const insertId = result.insertId;
    //         return { id: insertId, ...event };
    //     } catch (error) {
    //         console.error("Error inserting event:", error);
    //         throw new Error("Failed to insert event");
    //     }
    // }

    static async AddEvent(event: Omit<EventDM, "id">): Promise<EventDM> {
        try {
            const sanitize = <T>(value: T | undefined): T | null =>
                value === undefined ? null : value;

            const [result] = await db.execute<ResultSetHeader>(
                `INSERT INTO event (
                    event_name,
                    event_date,
                    collaboration,
                    event_heading,
                    heading_detail,
                    event_date_time,
                    event_location,
                    event_designedfor,
                    event_ticket,
                    event_booking_url,
                    workshops,
                    agenda,
                    speakers_heading,
                    speakers,
                    event_highlight_detail,
                    event_highlight_img,
                    hightlight_heading,
                    hightlight_subheading_1,
                    hightlight_subdetail_1,
                    hightlight_subheading_2,
                    hightlight_subdetail_2
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    sanitize(event.event_name),
                    sanitize(event.event_date),
                    sanitize(JSON.stringify(event.collaboration)),
                    sanitize(event.event_heading),
                    sanitize(event.heading_detail),
                    sanitize(event.event_date_time),
                    sanitize(event.event_location),
                    sanitize(event.event_designedfor),
                    sanitize(event.event_ticket),
                    sanitize(event.event_booking_url),
                    sanitize(JSON.stringify(event.workshops)),
                    sanitize(event.agenda),
                    sanitize(event.speakers_heading),
                    sanitize(JSON.stringify(event.speakers)),
                    sanitize(event.event_highlight_detail),
                    sanitize(JSON.stringify(event.event_highlight_img)),
                    sanitize(event.hightlight_heading),
                    sanitize(event.hightlight_subheading_1),
                    sanitize(event.hightlight_subdetail_1),
                    sanitize(event.hightlight_subheading_2),
                    sanitize(event.hightlight_subdetail_2),
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

            // Convert undefined to null to avoid MySQL error
            const sanitize = <T>(value: T | undefined): T | null =>
                value === undefined ? null : value;

            await db.execute(
                `UPDATE event SET
                event_name = ?,
                event_date = ?,
                collaboration = ?,
                event_heading = ?,
                heading_detail = ?,
                event_date_time = ?,
                event_location = ?,
                event_designedfor = ?,
                event_ticket = ?,
                event_booking_url = ?,
                workshops = ?,
                agenda = ?,
                speakers_heading = ?,
                speakers = ?,
                event_highlight_detail = ?,
                event_highlight_img = ?,
                hightlight_heading = ?,
                hightlight_subheading_1 = ?,
                hightlight_subdetail_1 = ?,
                hightlight_subheading_2 = ?,
                hightlight_subdetail_2 = ?,
                updated_at = ?
            WHERE id = ?`,
                [
                    sanitize(event.event_name),
                    sanitize(event.event_date),
                    sanitize(JSON.stringify(event.collaboration)),
                    sanitize(event.event_heading),
                    sanitize(event.heading_detail),
                    sanitize(event.event_date_time),
                    sanitize(event.event_location),
                    sanitize(event.event_designedfor),
                    sanitize(event.event_ticket),
                    sanitize(event.event_booking_url),
                    sanitize(JSON.stringify(event.workshops)),
                    sanitize(event.agenda),
                    sanitize(event.speakers_heading),
                    sanitize(JSON.stringify(event.speakers)),
                    sanitize(event.event_highlight_detail),
                    sanitize(JSON.stringify(event.event_highlight_img)),
                    sanitize(event.hightlight_heading),
                    sanitize(event.hightlight_subheading_1),
                    sanitize(event.hightlight_subdetail_1),
                    sanitize(event.hightlight_subheading_2),
                    sanitize(event.hightlight_subdetail_2),
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
                `UPDATE event
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
