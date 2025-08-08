import { NextRequest, NextResponse } from "next/server";
import { GenericRepo } from "@/repository/GenericRepo";

function getTableFromQuery(req: NextRequest): string | null {
  const { searchParams } = new URL(req.url);
  return searchParams.get("table");
}

export async function GET(req: NextRequest) {
  const table = getTableFromQuery(req);
  if (!table) {
    return NextResponse.json({ error: "Table name is required" }, { status: 400 });
  }

  try {
    const data = await GenericRepo.getAll(table);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return NextResponse.json({ error: `Failed to fetch ${table}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const table = getTableFromQuery(req);
  if (!table) {
    return NextResponse.json({ error: "Table name is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    if (!body.value) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }
    const newRecord = await GenericRepo.add(table, body.value);
    return NextResponse.json(
      { message: `${table} added successfully`, data: newRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error(`Error adding to ${table}:`, error);
    return NextResponse.json({ error: `Failed to add ${table}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const table = getTableFromQuery(req);
  if (!table) {
    return NextResponse.json({ error: "Table name is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    if (!body.id || !body.value) {
      return NextResponse.json({ error: "ID and value are required" }, { status: 400 });
    }
    await GenericRepo.update(table, body.id, body.value);
    return NextResponse.json({ message: `${table} updated successfully` });
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    return NextResponse.json({ error: `Failed to update ${table}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const table = getTableFromQuery(req);
  if (!table) {
    return NextResponse.json({ error: "Table name is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await GenericRepo.softDelete(table, body.id);
    return NextResponse.json({ message: `${table} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    return NextResponse.json({ error: `Failed to delete ${table}` }, { status: 500 });
  }
}
