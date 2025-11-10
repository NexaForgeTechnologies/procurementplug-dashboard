export interface InnovationDM {
    id: number;
    title: string;
    description?: string;
    logo?: string;
    category?: string;
    category_id?: number; // <-- add this
    keyFeatures?: string[];
    categoryDescription?: string;
    sponsoredBy?: string;
}

