import { NextRequest, NextResponse } from "next/server";
import { ProcuretechRepo } from '@/repository/procuretech/ProcuretechRepo';

export async function GET() {
    try {
        const procuretech = await ProcuretechRepo.getAllProcuretechSolutions();
        return NextResponse.json(procuretech, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for speakers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newProcureTech = await ProcuretechRepo.addProcuretechSolution(body);

        return NextResponse.json({ message: "ProcureTech added successfully", data: newProcureTech }, { status: 201 });
    } catch (error) {
        console.error("Error adding ProcureTech:", error);
        return NextResponse.json({ message: "Error adding ProcureTech" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await ProcuretechRepo.updateProcuretechSolution(body);

        return NextResponse.json({ message: "ProcureTech updated successfully" });

    } catch (error) {
        console.error("Error updating ProcureTech:", error);
        return NextResponse.json(
            { error: "Failed to update ProcureTech" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const json = await request.json();

        await ProcuretechRepo.deleteProcuretechSolution(json.id);
        return NextResponse.json(
            { message: "ProcureTech deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting ProcureTech:", error);
        return NextResponse.json(
            { error: "Failed to delete ProcureTech" },
            { status: 500 }
        );
    }
}