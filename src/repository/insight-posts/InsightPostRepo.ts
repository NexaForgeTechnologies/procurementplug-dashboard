import { RowDataPacket } from "mysql2";

import { db } from "@/lib/db";

import { InsightsPostDM } from "@/domain-models/insights-post/InsightsPostDM";

import { getFormattedTimestamp } from "@/utils/FormattedDate";


export class InsightPostRepo {
    static async getAllPosts(): Promise<InsightsPostDM[]> {
        try {
            const [rows] = await db.query<RowDataPacket[]>(`
                SELECT * FROM viplounge_insight_posts
                ORDER BY id DESC;
            `);

            const posts: InsightsPostDM[] = rows.map((row) => ({
                id: row.id,
                heading: row.heading,
                category: row.category,
                description: row.description,
                content_type: row.content_type,
                content: row.content,
                banner_img: row.banner_img,
                profile_logo: row.profile_logo,
                sponsor: row.sponsor,
                payment: row.payment,
                is_approved: row.is_approved,
                public_url: row.public_url,
                secret_url: row.secret_url,
                access_token: row.access_token,
                session_id: row.session_id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
            }));
            return posts;
        } catch (error) {
            console.error("Error fetching all posts:", error);
            throw new Error("Unable to fetch posts from the database");
        }
    }

    static async updatePost(post: InsightsPostDM) {

        try {
            const currentTime = getFormattedTimestamp();
            await db.execute(
                `
                UPDATE viplounge_insight_posts
                SET is_approved = ?, updated_at = ?
                WHERE id = ?
            `,
                [
                    post.is_approved,
                    currentTime,
                    post.id,
                ]
            );

            return { message: "Insight Post updated successfully" };
        } catch (error) {
            console.error("Error updating Insight Post:", error);
            throw new Error("Unable to update Insight Post in the database");
        }
    }
}
