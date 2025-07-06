import { NextRequest, NextResponse } from "next/server";
import { EventRepo } from '@/repository/EventRepo';

export async function GET() {
    try {
        const events = await EventRepo.getAllEvents();
        return NextResponse.json(events, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for events' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newEvent = await EventRepo.AddEvent(body);

        return NextResponse.json({ message: "Event added successfully", data: newEvent }, { status: 201 });
    } catch (error) {
        console.error("Error adding event:", error);
        return NextResponse.json({ message: "Error adding event" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        await EventRepo.UpdateEvent(body);

        return NextResponse.json({ message: "event updated successfully" });

    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const json = await request.json();

        await EventRepo.DeleteEvent(json.id);
        return NextResponse.json(
            { message: "Event deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Event:", error);
        return NextResponse.json(
            { error: "Failed to delete Event" },
            { status: 500 }
        );
    }
}