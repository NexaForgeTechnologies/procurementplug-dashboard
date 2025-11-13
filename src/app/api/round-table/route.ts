import { NextRequest, NextResponse } from "next/server";

import { HostRoundtableRepo } from "@/repository/round-table/HostRoundtableRepo";

// 🔹 GET — Fetch
export async function GET() {
    try {
        const tables = await HostRoundtableRepo.getAllTables();
        return NextResponse.json(tables, { status: 200 });
    } catch (error) {
        console.error("Error fetching round tables:", error);
        return NextResponse.json(
            { error: "Failed to fetch round tables" },
            { status: 500 }
        );
    }
}

// 🔹 PUT — Update
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await HostRoundtableRepo.updateRoundtable(body);

        return NextResponse.json({
            message: "Roundtable updated successfully",
        });
    } catch (error) {
        console.error("Error updating Roundtable:", error);
        return NextResponse.json(
            { error: "Failed to update Roundtable" },
            { status: 500 }
        );
    }
}