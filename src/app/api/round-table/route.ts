import { ExclusivePartnerRepo } from "@/repository/exclusive-partners/ExclusivePartnerRepo";
import { NextRequest, NextResponse } from "next/server";

// 🔹 GET — Fetch all exclusive partners
export async function GET() {
    try {
        const partners = await ExclusivePartnerRepo.getAllPartners();
        return NextResponse.json(partners, { status: 200 });
    } catch (error) {
        console.error("Error fetching exclusive partners:", error);
        return NextResponse.json(
            { error: "Failed to fetch exclusive partners" },
            { status: 500 }
        );
    }
}

// 🔹 POST — Add a new exclusive partner
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newPartner = await ExclusivePartnerRepo.addPartner(body);

        return NextResponse.json(
            { message: "Exclusive partner added successfully", data: newPartner },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding exclusive partner:", error);
        return NextResponse.json(
            { message: "Error adding exclusive partner" },
            { status: 500 }
        );
    }
}

// 🔹 PUT — Update an exclusive partner
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        await ExclusivePartnerRepo.updatePartner(body);

        return NextResponse.json({
            message: "Exclusive partner updated successfully",
        });
    } catch (error) {
        console.error("Error updating exclusive partner:", error);
        return NextResponse.json(
            { error: "Failed to update exclusive partner" },
            { status: 500 }
        );
    }
}

// 🔹 DELETE — Remove an exclusive partner
export async function DELETE(req: NextRequest) {
    try {
        const idParam = req.nextUrl.searchParams.get("id");
        const id = Number(idParam);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 });
        }

        await ExclusivePartnerRepo.deletePartner(id);
        return NextResponse.json({ message: "Exclusive partner deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting exclusive partner:", error);
        return NextResponse.json({ error: "Failed to delete exclusive partner" }, { status: 500 });
    }
}