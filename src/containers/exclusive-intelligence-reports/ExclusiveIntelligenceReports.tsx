"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExclusiveIntelligenceReportsDM } from "@/domain-models/exclusive-intelligence-reports/ExclusiveIntelligenceReportsDM";
import ExclusiveIntelligenceReportCard from "@/components/cards/ExclusiveIntelligenceReportCard";
import AddExclusiveIntelligenceReport from "@/components/forms/exclusive-intelligence-reports/AddExclusiveIntelligenceReport";
import EditExclusiveIntelligenceReport from "@/components/forms/exclusive-intelligence-reports/EditExclusiveIntelligenceReport";

export default function ExclusiveIntelligenceReports() {
    const [searchTerm, setSearchTerm] = useState("");

    // 🔄 Fetch Exclusive Intelligence Reports
    const fetchReports = async (): Promise<ExclusiveIntelligenceReportsDM[]> => {
        const response = await axios.get<ExclusiveIntelligenceReportsDM[]>(
            "/api/exclusive-intelligence-reports"
        );
        return response.data;
    };

    const { data: reports, refetch, isLoading } = useQuery<ExclusiveIntelligenceReportsDM[]>({
        queryKey: ["exclusive-intelligence-reports"],
        queryFn: fetchReports,
    });

    const filteredReports = reports?.filter((r) => {
        const term = searchTerm.toLowerCase();
        const matchCategory =
            r.category_industry?.some((c) =>
                c.toLowerCase().includes(term)
            );
        const matchType =
            r.reportType?.some((t) =>
                t.toLowerCase().includes(term)
            );

        const matchSponsor =
            r.sponsor?.some((s) =>
                s.toLowerCase().includes(term)
            );
        const matchTitle = r.reportTitle?.toLowerCase().includes(term);
        return matchCategory || matchType || matchSponsor || matchTitle;
    });


    const [isActive, setIsActive] = useState(false);
    const handleClick = () => setIsActive(!isActive);

    const [activeEditMode, setActiveEditMode] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ExclusiveIntelligenceReportsDM | null>(null);

    const handleEditReport = (report: ExclusiveIntelligenceReportsDM) => {
        setActiveEditMode(!activeEditMode);
        setSelectedReport((prev) => (prev?.id === report.id ? null : report));
    };

    return (
        <>
            <div className="max-w-[780px] m-auto text-center">
                <h3 className="font-extrabold text-3xl md:text-5xl mb-4 md:mb-6 text-[#010101]">
                    Exclusive Intelligence Reports
                </h3>
                <p className="text-[#363636] text-sm md:text-lg leading-normal md:leading-relaxed">
                    Access exclusive procurement intelligence insights, market analysis, and industry trend reports.
                </p>

                {/* 🔍 Search + Add Button */}
                <div className="flex items-center gap-2 sm:gap-4 my-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search reports..."
                        className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />

                    <button
                        onClick={handleClick}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all duration-300 min-w-max py-3 px-4"
                    >
                        + <span className="hidden sm:inline">&nbsp;Report</span>
                    </button>
                </div>
            </div>

            {/* Cards / Loader / No Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-[#85009D] animate-spin"></div>
                    </div>
                ) : filteredReports?.length ? (
                    filteredReports.map((report) => (
                        <ExclusiveIntelligenceReportCard
                            key={report.id}
                            data={report}
                            refetchReports={refetch}
                            openEditForm={handleEditReport}
                        />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-lg py-20">
                        No intelligence reports found.
                    </p>
                )}
            </div>

            {/* Add Report Form */}
            {isActive && (
                <AddExclusiveIntelligenceReport
                    active={isActive}
                    onClose={() => {
                        setIsActive(false);
                        refetch();
                    }}
                    refetchReports={refetch}
                />
            )}

            {/* Edit Report Form */}
            {activeEditMode && selectedReport && (
                <EditExclusiveIntelligenceReport
                    report={selectedReport}
                    onClose={() => {
                        setActiveEditMode(false);
                        setSelectedReport(null);
                        refetch();
                    }}
                    refetchReports={refetch}
                    active={activeEditMode}
                />
            )}
        </>
    );
}
