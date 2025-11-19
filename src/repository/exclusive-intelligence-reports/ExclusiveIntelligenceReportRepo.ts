import { db } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";

export class ExclusiveIntelligenceReportRepo {
  // 🔹 Get all reports
  async getAllReports(): Promise<ExclusiveIntelligenceReportsDM[]> {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM exclusive_intelligence_reports"
      );

      return rows.map((row) => ({
        id: row.id,
        imagePath: row.image_path,
        reportTitle: row.report_title,
        filePath: row.file_path,
        category_industry: JSON.parse(row.category_industry || "[]"),
        reportType: JSON.parse(row.report_type || "[]"),
        sponsor: JSON.parse(row.sponsor || "[]"),
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw new Error("Unable to fetch exclusive intelligence reports");
    }
  }

  // 🔹 Get single report by ID
  async getReportById(id: number): Promise<ExclusiveIntelligenceReportsDM | null> {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM exclusive_intelligence_reports WHERE id = ?",
        [id]
      );

      const row = rows[0];
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
    } catch (error) {
      console.error(`Error fetching report with ID ${id}:`, error);
      throw new Error("Unable to fetch report by ID");
    }
  }

  // 🔹 Create new report
  async createReport(
    report: ExclusiveIntelligenceReportsDM
  ): Promise<number> {
    try {
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

      const [result] = await db.execute<ResultSetHeader>(sql, params);
      return result.insertId;
    } catch (error) {
      console.error("Error creating report:", error);
      throw new Error("Failed to create report");
    }
  }

  // 🔹 Update report
  async updateReport(
    id: number,
    report: ExclusiveIntelligenceReportsDM
  ): Promise<boolean> {
    try {
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

      const [result] = await db.execute<ResultSetHeader>(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating report with ID ${id}:`, error);
      throw new Error("Failed to update report");
    }
  }

  // 🔹 Delete report
  async deleteReport(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute<ResultSetHeader>(
        "DELETE FROM exclusive_intelligence_reports WHERE id = ?",
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting report with ID ${id}:`, error);
      throw new Error("Failed to delete report");
    }
  }
}
