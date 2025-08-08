import { NextRequest, NextResponse } from "next/server";
import { GenericRepo } from "@/repository/GenericRepo";

const tableName = "regions";

export async function GET() {
    try {
        const data = await GenericRepo.getAll(tableName);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return NextResponse.json({ error: `Failed to fetch ${tableName}` }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.value) {
            return NextResponse.json({ error: "Value is required" }, { status: 400 });
        }
        const newRecord = await GenericRepo.add(tableName, body.value);
        return NextResponse.json({ message: `${tableName} added successfully`, data: newRecord }, { status: 201 });
    } catch (error) {
        console.error(`Error adding to ${tableName}:`, error);
        return NextResponse.json({ error: `Failed to add ${tableName}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id || !body.value) {
            return NextResponse.json({ error: "ID and value are required" }, { status: 400 });
        }
        await GenericRepo.update(tableName, body.id, body.value);
        return NextResponse.json({ message: `${tableName} updated successfully` });
    } catch (error) {
        console.error(`Error updating ${tableName}:`, error);
        return NextResponse.json({ error: `Failed to update ${tableName}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        await GenericRepo.softDelete(tableName, body.id);
        return NextResponse.json({ message: `${tableName} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        return NextResponse.json({ error: `Failed to delete ${tableName}` }, { status: 500 });
    }
}
