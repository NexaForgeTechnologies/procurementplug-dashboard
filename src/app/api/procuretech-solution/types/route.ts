import { NextResponse } from "next/server";
import { ProcuretechRepo } from '@/repository/procuretech/ProcuretechRepo';

export async function GET() {
    try {
        const procuretech = await ProcuretechRepo.getAllProcureTechtTypes();
        return NextResponse.json(procuretech, { status: 200 });
    }
    catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.json({ error: 'Failed to process GET request for speakers' }, { status: 500 });
    }
}