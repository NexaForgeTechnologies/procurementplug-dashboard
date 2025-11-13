export interface RoundTableDM {
    id?: number;
    session_id?: string;
    name?: string;
    email?: string;
    website?: string;
    companyName?: string;
    package?: string;
    title?: string;
    duration?: string;
    description?: string;
    targetAudience?: string;
    date?: string;
    banner_image?: string;
    logo_image?: string;
    quantity?: string;
    payment?: string;
    subscription_type?: string;
    meta_quantity?: string;
    status?: string;
    is_approved?: number;

    createdAt?: Date | null;
    updatedAt?: Date | null;
}