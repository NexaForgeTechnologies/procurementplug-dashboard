import { NextRequest, NextResponse } from "next/server";
import { ConsultantRepo } from '@/repository/ConsultantRepo';

export async function GET() {
    try {
        const consultants = await ConsultantRepo.getAllConsultants();
        return NextResponse.json(consultants, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for speakers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newConsultant = await ConsultantRepo.AddConsultant(body);

        return NextResponse.json({ message: "Consultant added successfully", data: newConsultant }, { status: 201 });
    } catch (error) {
        console.error("Error adding consultant:", error);
        return NextResponse.json({ message: "Error adding consultant" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await ConsultantRepo.UpdateConsultant(body);

        return NextResponse.json({ message: "Consultant updated successfully" });

    } catch (error) {
        console.error("Error updating Consultant:", error);
        return NextResponse.json(
            { error: "Failed to update Consultant" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const json = await request.json();

        await ConsultantRepo.DeleteConsultant(json.id);
        return NextResponse.json(
            { message: "Consultant deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Consultant:", error);
        return NextResponse.json(
            { error: "Failed to delete Consultant" },
            { status: 500 }
        );
    }
}