// app/api/exclusive-intelligence-reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ExclusiveIntelligenceReportRepo } from "@/repository/exclusive-intelligence-reports/ExclusiveIntelligenceReportRepo";
import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";

const repo = new ExclusiveIntelligenceReportRepo();

export async function GET() {
  try {
    const reports = await repo.getAllReports();
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching exclusive intelligence reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch exclusive intelligence reports" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ExclusiveIntelligenceReportsDM = await req.json();
    const insertId = await repo.createReport(body);
    return NextResponse.json({ id: insertId, ...body }, { status: 201 });
  } catch (error) {
    console.error("Error adding exclusive intelligence report:", error);
    return NextResponse.json(
      { error: "Failed to add exclusive intelligence report" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...body }: { id: number } & ExclusiveIntelligenceReportsDM = await req.json();
    const updated = await repo.updateReport(id, body);
    if (!updated) return NextResponse.json({ error: "Report not found" }, { status: 404 });
    return NextResponse.json({ message: "Report updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating exclusive intelligence report:", error);
    return NextResponse.json(
      { error: "Failed to update exclusive intelligence report" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const id = parseInt(idParam, 10);
    const deleted = await repo.deleteReport(id);

    if (!deleted) return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting exclusive intelligence report:", error);
    return NextResponse.json(
      { error: "Failed to delete exclusive intelligence report" },
      { status: 500 }
    );
  }
}
