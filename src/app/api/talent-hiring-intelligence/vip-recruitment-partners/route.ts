import { VipRecruitmentPartnerRepo } from "@/repository/talent-hiring-intelligence/VipRecruitmentPartnerRepo";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const partners = await VipRecruitmentPartnerRepo.getAllPartners();
        return NextResponse.json(partners, { status: 200 });
    } catch (error) {
        console.error("Error fetching vip recruitment partners:", error);
        return NextResponse.json(
            { error: "Failed to fetch vip recruitment partners" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("API : ", body);
        const newPartner = await VipRecruitmentPartnerRepo.addPartner(body);

        return NextResponse.json(
            { message: "Vip recruitment partner added successfully", data: newPartner },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding vip recruitment partner:", error);
        return NextResponse.json(
            { message: "Error adding vip recruitment partner" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const idParam = req.nextUrl.searchParams.get("id");
        const id = Number(idParam);
        console.log("Delete Partner id : ", id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: "Invalid vip recruitment partner ID" },
                { status: 400 }
            );
        }

        await VipRecruitmentPartnerRepo.deletePartner(id);
        return NextResponse.json(
            { insertID: id, message: "Vip recruitment partner deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error Deleting vip recruitment partner:", error);
        return NextResponse.json(
            { message: "Error Deleting vip recruitment partner" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
    const body = await req.json();
    await VipRecruitmentPartnerRepo.updatePartner(body);
        return NextResponse.json(
            { message: "Vip recruitment partner updated successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error Updating vip recruitment partner:", error);
        return NextResponse.json(
            { message: "Error Updating vip recruitment partner" },
            { status: 500 }
        );
    }
}