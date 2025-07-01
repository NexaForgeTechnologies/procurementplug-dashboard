export interface EventDM {
    id?: number;
    heading?: string;
    date_time?: string;
    location?: string;
    designed_for?: string

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}