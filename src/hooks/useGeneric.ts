import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { GenericDM } from "@/domain-models/GenericDM";

/**
 * Fetch lookup table records from generic API
 */
const fetchGeneric = async (tableName: string): Promise<GenericDM[]> => {
    const response = await axios.get<GenericDM[]>(`/api/generic?table=${tableName}`);
    return response.data;
};

/**
 * React Query Hook to get any lookup table
 */
export const useGeneric = (tableName: string) => {
    return useQuery<GenericDM[]>({
        queryKey: [tableName],
        queryFn: () => fetchGeneric(tableName),
    });
};
