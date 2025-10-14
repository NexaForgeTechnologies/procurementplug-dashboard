// src/repositories/VenuPartnerRepo.ts
import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { VenuPartnerDM } from "@/domain-models/venue-partner/VenuePartnerDM";

export class VenuPartnerRepo {
    static async getAllVenuePartners(): Promise<VenuPartnerDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT 
                    vp.id,
                    vp.img,
                    vp.name,
                    vp.location,
                    vp.capacity_id,
                    c.value AS capacity_name,
                    vp.amenity_id,
                    a.value AS amenity_name,
                    vp.overview,
                    vp.testimonials,
                    vp.created_at,
                    vp.updated_at,
                    vp.deleted_at
                FROM venu_partners vp
                LEFT JOIN capacities c ON vp.capacity_id = c.id
                LEFT JOIN amenities a ON vp.amenity_id = a.id
                WHERE vp.deleted_at IS NULL
                ORDER BY vp.id DESC;
            `);

            const venuePartners: VenuPartnerDM[] = rows.map((row) => ({
                id: row.id,
                img: row.img,
                name: row.name,
                location: row.location,
                capacity_id: row.capacity_id,
                capacity_name: row.capacity_name,
                amenity_id: row.amenity_id,
                amenity_name: row.amenity_name,
                overview: row.overview,
                testimonials: row.testimonials,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));

            return venuePartners;
        } catch (error) {
            console.error("Error fetching venue partners:", error);
            throw new Error("Unable to fetch venue partners from the database");
        }
    }

    static async AddVenuePartner(
        venuePartner: Omit<VenuPartnerDM, "id" | "created_at" | "updated_at" | "deleted_at">
    ): Promise<VenuPartnerDM> {
        try {
            const [result] = await db.execute(
                `INSERT INTO venu_partners (
                    img,
                    name,
                    location,
                    capacity_id,
                    amenity_id,
                    overview,
                    testimonials
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    venuePartner.img,
                    venuePartner.name,
                    venuePartner.location,
                    venuePartner.capacity_id,
                    venuePartner.amenity_id,
                    venuePartner.overview,
                    venuePartner.testimonials,
                ]
            ) as [ResultSetHeader, unknown];

            const insertId = result.insertId;

            return {
                id: insertId,
                ...venuePartner,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                deleted_at: null,
            };
        } catch (error) {
            console.error("Error inserting venue partner:", error);
            throw new Error("Failed to insert venue partner");
        }
    }

    static async UpdateVenuePartner(venuePartner: VenuPartnerDM) {
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE venu_partners
                SET 
                    img = ?, 
                    name = ?, 
                    location = ?, 
                    capacity_id = ?, 
                    amenity_id = ?, 
                    overview = ?, 
                    testimonials = ?, 
                    updated_at = ?
                WHERE id = ?
                `,
                [
                    venuePartner.img,
                    venuePartner.name,
                    venuePartner.location,
                    venuePartner.capacity_id,
                    venuePartner.amenity_id,
                    venuePartner.overview,
                    venuePartner.testimonials,
                    currentTime,
                    venuePartner.id,
                ]
            );

            return { message: "Venue partner updated successfully" };
        } catch (error) {
            console.error("Error updating venue partner:", error);
            throw new Error("Unable to update venue partner");
        }
    }

    static async DeleteVenuePartner(id: number) {
        const currentTime = getFormattedTimestamp();

        try {
            await db.query(
                `
                UPDATE venu_partners
                SET deleted_at = ?,
                img = ''
                WHERE id = ?
                `,
                [currentTime, id]
            );

            return { message: "Venue partner deleted successfully" };
        } catch (error) {
            console.error("Error deleting venue partner:", error);
            throw new Error("Failed to delete venue partner");
        }
    }
}
