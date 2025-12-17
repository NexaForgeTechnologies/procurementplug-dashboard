import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { RoundTableDM } from "@/domain-models/round-table/RoundTableDM";

/**
 * Fetch records
 */
const fetchRoundTables = async (): Promise<RoundTableDM[]> => {
    const response = await axios.get<RoundTableDM[]>(`/api/round-table`);
    return response.data;
};

/**
 * React Query Hook to get any lookup table
 */
export const useRoundTables = () => {
    return useQuery<RoundTableDM[]>({
        queryKey: ["round-tables"],
        queryFn: () => fetchRoundTables(),
    });
};
