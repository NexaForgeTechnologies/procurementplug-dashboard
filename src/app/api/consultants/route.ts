import { NextRequest, NextResponse } from "next/server";
import { ConsultantRepo } from '@/repository/ConsultantRepo';
import { ConsultantDM } from "@/domain-models/ConsultantDM";


export async function GET(req: Request) {
    try {
        const consultants = await ConsultantRepo.getAllConsultant();
        return NextResponse.json(consultants, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for consultants' }, { status: 500 });
    }
}


// export async function POST(req: NextRequest) {
//     try {
//         const params = await req.json();

//         await ClientRepository.CreateClient(params);

//         return NextResponse.json({ message: "Partner added successfully" });
//     } catch (error) {
//         console.error("Error adding client:", error);
//         return NextResponse.json({ message: "Error adding client" }, { status: 500 });
//     }
// }

// export async function PUT(req: NextRequest) {
//     try {
//         const params = await req.json();

//         await ClientRepository.UpdateClient(params);

//         return NextResponse.json({ message: "Partner updated successfully" });

//     } catch (error) {
//         console.error("Error updating Client:", error);
//         return NextResponse.json(
//             { error: "Failed to update Client" },
//             { status: 500 }
//         );
//     }
// }

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