import { InnovationVaultRepo } from "@/repository/innovation-vault/InnovationVaultRepo";
import { NextRequest, NextResponse } from "next/server";

// 🔹 GET — Fetch all innovations
export async function GET() {
  try {
    const innovations = await InnovationVaultRepo.getAllInnovations();
    return NextResponse.json(innovations, { status: 200 });
  } catch (error) {
    console.error("Error fetching innovations:", error);
    return NextResponse.json(
      { error: "Failed to fetch innovations" },
      { status: 500 }
    );
  }
}

// 🔹 POST — Add a new innovation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newInnovation = await InnovationVaultRepo.addInnovation(body);

    return NextResponse.json(
      { message: "Innovation added successfully", data: newInnovation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding innovation:", error);
    return NextResponse.json(
      { message: "Error adding innovation" },
      { status: 500 }
    );
  }
}

// 🔹 PUT — Update an innovation
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await InnovationVaultRepo.updateInnovation(body);

    return NextResponse.json({
      message: "Innovation updated successfully",
    });
  } catch (error) {
    console.error("Error updating innovation:", error);
    return NextResponse.json(
      { error: "Failed to update innovation" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE — Remove an innovation
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;  // Access query params
    const id = searchParams.get("id");     // Get the "id" param
    console.log("innovation id : ", id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid innovation ID" }, { status: 400 });
    }

    // Delete innovation
    await InnovationVaultRepo.deleteInnovation(Number(id));

    return NextResponse.json({ message: "Innovation deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting innovation:", error);
    return NextResponse.json({ error: "Failed to delete innovation" }, { status: 500 });
  }
}
