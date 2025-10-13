export interface SpeakerDM {
    id?: number;
    img?: string;
    name?: string;
    role?: string;
    designation?: string;
    company?: string;
    bg_color?: string;
    bio?: string;
    value?: string;

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}