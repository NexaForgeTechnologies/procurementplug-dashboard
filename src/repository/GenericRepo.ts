import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getFormattedTimestamp } from "@/utils/FormattedDate";
import { GenericDM } from "@/domain-models/GenericDM";

export class GenericRepo {
    static async getAll(tableName: string): Promise<GenericDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT id, value, created_at, updated_at, deleted_at
                FROM ${tableName}
                WHERE deleted_at IS NULL
                ORDER BY id DESC
            `);

            return rows as GenericDM[];
        } catch (error) {
            console.error(`Error fetching from ${tableName}:`, error);
            throw new Error(`Unable to fetch records from ${tableName}`);
        }
    }

    static async add(tableName: string, value: string): Promise<GenericDM> {
        try {
            const [result] = await db.execute(
                `INSERT INTO ${tableName} (value) VALUES (?)`,
                [value]
            ) as [ResultSetHeader, unknown];

            const insertId = result.insertId;
            const timestamp = getFormattedTimestamp();

            return {
                id: insertId,
                value,
                created_at: timestamp,
                updated_at: timestamp,
                deleted_at: null,
            };
        } catch (error) {
            console.error(`Error inserting into ${tableName}:`, error);
            throw new Error(`Failed to insert record into ${tableName}`);
        }
    }

    static async update(tableName: string, id: number, value: string) {
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE ${tableName}
                SET value = ?, updated_at = ?
                WHERE id = ?
                `,
                [value, currentTime, id]
            );

            return { message: `${tableName} updated successfully` };
        } catch (error) {
            console.error(`Error updating ${tableName}:`, error);
            throw new Error(`Unable to update record in ${tableName}`);
        }
    }

    static async softDelete(tableName: string, id: number) {
        try {
            const currentTime = getFormattedTimestamp();

            await db.execute(
                `
                UPDATE ${tableName}
                SET deleted_at = ?
                WHERE id = ?
                `,
                [currentTime, id]
            );

            return { message: `${tableName} deleted successfully` };
        } catch (error) {
            console.error(`Error deleting from ${tableName}:`, error);
            throw new Error(`Failed to delete record from ${tableName}`);
        }
    }
}
