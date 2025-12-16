import { NextRequest, NextResponse } from "next/server";

import { InsightPostRepo } from "@/repository/insight-posts/InsightPostRepo";

// 🔹 GET — Fetch
export async function GET() {
    try {
        const posts = await InsightPostRepo.getAllPosts();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

// 🔹 PUT — Update
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await InsightPostRepo.updatePost(body);

        // await ApproveRoundtableEmail(body.selectedRoundTable);

        return NextResponse.json({
            message: "Insight Post updated successfully",
        });
    } catch (error) {
        console.error("Error updating Insight Post:", error);
        return NextResponse.json(
            { error: "Failed to update Insight Post" },
            { status: 500 }
        );
    }
}