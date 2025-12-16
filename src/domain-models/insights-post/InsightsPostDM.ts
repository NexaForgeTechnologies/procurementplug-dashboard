export interface InsightsPostDM {
    id?: number;
    heading?: string;
    category?: string;
    description?: string;
    content_type?: string;
    content?: string;
    banner_img?: string;
    profile_logo?: string;
    sponsor?: string;
    payment?: string;
    is_approved?: number;
    public_url?: string;
    secret_url?: string;
    access_token?: string;
    session_id?: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}