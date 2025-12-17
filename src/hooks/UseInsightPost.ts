import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { InsightsPostDM } from "@/domain-models/insights-post/InsightsPostDM";

/**
 * Fetch records
 */
const fetchPosts = async (): Promise<InsightsPostDM[]> => {
    const response = await axios.get<InsightsPostDM[]>(`/api/insights-post`);
    return response.data;
};

/**
 * React Query Hook to get any lookup table
 */
export const useInsightPosts = () => {
    return useQuery<InsightsPostDM[]>({
        queryKey: ["insight-posts"],
        queryFn: () => fetchPosts(),
    });
};
