// src/app/api/venu-partners/route.ts
import { NextRequest, NextResponse } from "next/server";
import { VenuPartnerRepo } from "@/repository/venu-partner/VenuPartnerRepo";

export async function GET() {
    try {
        const venuePartners = await VenuPartnerRepo.getAllVenuePartners();
        return NextResponse.json(venuePartners, { status: 200 });
    } catch (error) {
        console.error("Error processing GET request:", error);
        return NextResponse.json(
            { error: "Failed to process GET request for venue partners" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newVenuePartner = await VenuPartnerRepo.AddVenuePartner(body);
        return NextResponse.json(
            { message: "Venue partner added successfully", data: newVenuePartner },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding venue partner:", error);
        return NextResponse.json(
            { message: "Error adding venue partner" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        await VenuPartnerRepo.UpdateVenuePartner(body);
        return NextResponse.json({ message: "Venue partner updated successfully" });
    } catch (error) {
        console.error("Error updating venue partner:", error);
        return NextResponse.json(
            { error: "Failed to update venue partner" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const json = await req.json();
        await VenuPartnerRepo.DeleteVenuePartner(json.id);
        return NextResponse.json(
            { message: "Venue partner deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting venue partner:", error);
        return NextResponse.json(
            { error: "Failed to delete venue partner" },
            { status: 500 }
        );
    }
}
