import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProcuretechTypeDM } from "@/domain-models/procuretech-solution/type/ProcuretechTypeDM";

/**
 * Fetch records
 */
const fetchProcuretechTypes = async (): Promise<ProcuretechTypeDM[]> => {
    const response = await axios.get<ProcuretechTypeDM[]>(`/api/procuretech-solution/types`);
    return response.data;
};

/**
 * React Query Hook to get any lookup table
 */
export const useProcuretechTypes = () => {
    return useQuery<ProcuretechTypeDM[]>({
        queryKey: ["types"],
        queryFn: () => fetchProcuretechTypes(),
    });
};
