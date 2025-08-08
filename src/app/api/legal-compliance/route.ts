import { NextRequest, NextResponse } from "next/server";
import { LegalComplianceRepo } from '@/repository/legal-compliance/LegalComplianceRepo';

export async function GET() {
    try {
        const legal_compliance = await LegalComplianceRepo.getAllCompliance();
        return NextResponse.json(legal_compliance, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for speakers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newLegalCompliance = await LegalComplianceRepo.AddLegalCompliance(body);

        return NextResponse.json({ message: "Legal Compliance added successfully", data: newLegalCompliance }, { status: 201 });
    } catch (error) {
        console.error("Error adding Legal Compliance:", error);
        return NextResponse.json({ message: "Error adding Legal Compliance" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await LegalComplianceRepo.UpdateLegalCompliance(body);

        return NextResponse.json({ message: "Legal Compliance updated successfully" });

    } catch (error) {
        console.error("Error updating Legal Compliance:", error);
        return NextResponse.json(
            { error: "Failed to update Legal Compliance" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const json = await request.json();

        await LegalComplianceRepo.DeleteLegalCompliance(json.id);
        return NextResponse.json(
            { message: "Legal Compliance deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Legal Compliance:", error);
        return NextResponse.json(
            { error: "Failed to delete Legal Compliance" },
            { status: 500 }
        );
    }
}