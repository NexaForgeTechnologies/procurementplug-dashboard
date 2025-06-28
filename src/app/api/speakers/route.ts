import { NextRequest, NextResponse } from "next/server";
import { SpeakerRepo } from '@/repository/SpeakerRepo';
import { SpeakerDM } from "@/domain-models/SpeakerDM";


export async function GET(req: Request) {
    try {
        const speakers = await SpeakerRepo.getAllSpeakers();
        return NextResponse.json(speakers, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for speakers' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newSpeaker = await SpeakerRepo.AddSpeaker(body);

        return NextResponse.json({ message: "Speaker added successfully", data: newSpeaker }, { status: 201 });
    } catch (error) {
        console.error("Error adding speaker:", error);
        return NextResponse.json({ message: "Error adding speaker" }, { status: 500 });
    }
}

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

        await SpeakerRepo.DeleteSpeaker(json.id);
        return NextResponse.json(
            { message: "Speaker deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Speaker:", error);
        return NextResponse.json(
            { error: "Failed to delete Speaker" },
            { status: 500 }
        );
    }
}