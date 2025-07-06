export interface SpeakerDM {
    id?: number;
    img?: string;
    name?: string;
    role?: string;
    designation?: string;
    company?: string;
    bg_color?: string;
    // industry_id?: string;
    // industry_name?: string;
    // location?: string;
    // specialism_id?: string;
    // specialism_name?: string;
    value?: string;

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}