import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";
import { db } from "@/lib/db";
export class ExclusiveIntelligenceReportRepo {
    // 🔹 Get all reports
    async getAllReports(): Promise<ExclusiveIntelligenceReportsDM[]>  {
        const [rows] = await db.query("SELECT * FROM exclusive_intelligence_reports");

        return (rows as any[]).map((row) => ({
            id: row.id,
            imagePath: row.image_path,
            reportTitle: row.report_title,
            filePath: row.file_path,
            category_industry: JSON.parse(row.category_industry || "[]"),
            reportType: JSON.parse(row.report_type || "[]"),
            sponsor: JSON.parse(row.sponsor || "[]"),
        }));
    }

    // 🔹 Get single report by ID
    async getReportById(id: number): Promise<ExclusiveIntelligenceReportsDM | null> {
        const [rows] = await db.query("SELECT * FROM exclusive_intelligence_reports WHERE id = ?", [id]);

        const row = (rows as any[])[0];
        if (!row) return null;

        return {
            id: row.id,
            imagePath: row.image_path,
            reportTitle: row.report_title,
            filePath: row.file_path,
            category_industry: JSON.parse(row.category_industry || "[]"),
            reportType: JSON.parse(row.report_type || "[]"),
            sponsor: JSON.parse(row.sponsor || "[]"),
        };
    }

    // 🔹 Create new report
    async createReport(report: ExclusiveIntelligenceReportsDM): Promise<number> {
        const sql = `
            INSERT INTO exclusive_intelligence_reports 
            (image_path, report_title, file_path, category_industry, report_type, sponsor)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const params = [
            report.imagePath || null,
            report.reportTitle,
            report.filePath || null,
            JSON.stringify(report.category_industry),
            JSON.stringify(report.reportType),
            JSON.stringify(report.sponsor),
        ];

        const [result]: any = await db.query(sql, params);
        return result.insertId;
    }

    // 🔹 Update report
    async updateReport(id: number, report: ExclusiveIntelligenceReportsDM): Promise<boolean> {
        const sql = `
            UPDATE exclusive_intelligence_reports
            SET image_path = ?, report_title = ?, file_path = ?, 
                category_industry = ?, report_type = ?, sponsor = ?
            WHERE id = ?
        `;

        const params = [
            report.imagePath || null,
            report.reportTitle,
            report.filePath || null,
            JSON.stringify(report.category_industry),
            JSON.stringify(report.reportType),
            JSON.stringify(report.sponsor),
            id,
        ];

        const [result]: any = await db.query(sql, params);
        return result.affectedRows > 0;
    }

    // 🔹 Delete report
    async deleteReport(id: number): Promise<boolean> {
        const [result]: any = await db.query(
            "DELETE FROM exclusive_intelligence_reports WHERE id = ?",
            [id]
        );

        return result.affectedRows > 0;
    }
}
