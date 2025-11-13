import { TalentHiringIntelligenceRepo } from "@/repository/talent-hiring-intelligence/TalentHiringIntellingenceRepo"; 
import { NextRequest, NextResponse } from "next/server";

// 🔹 GET — Fetch all talent hiring records
export async function GET() {
  try {
    const talents = await TalentHiringIntelligenceRepo.getAllTalents();
    return NextResponse.json(talents, { status: 200 });
  } catch (error) {
    console.error("Error fetching talent records:", error);
    return NextResponse.json(
      { error: "Failed to fetch talent records" },
      { status: 500 }
    );
  }
}

// 🔹 POST — Add a new talent record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const newTalent = await TalentHiringIntelligenceRepo.addTalent(body);

    return NextResponse.json(
      { message: "Talent added successfully", data: newTalent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding talent:", error);
    return NextResponse.json(
      { message: "Error adding talent" },
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update a talent record
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await TalentHiringIntelligenceRepo.updateTalent(body);

    return NextResponse.json({
      message: "Talent updated successfully",
    });
  } catch (error) {
    console.error("Error updating talent:", error);
    return NextResponse.json(
      { error: "Failed to update talent" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Remove a talent record
export async function DELETE(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");
    const id = Number(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid talent ID" }, { status: 400 });
    }

    await TalentHiringIntelligenceRepo.deleteTalent(id);
    return NextResponse.json({ message: "Talent deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting talent:", error);
    return NextResponse.json({ error: "Failed to delete talent" }, { status: 500 });
  }
}
