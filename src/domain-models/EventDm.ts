export interface EventDM {
    id?: number;
    event_name?: string;
    event_date?: string;
    collaboration?: string;
    event_heading?: string;
    heading_detail?: string;
    event_date_time?: string;
    event_location?: string;
    event_designedfor?: string;
    event_ticket?: string;
    event_booking_url?: string;
    speakers_ids?: string[];
    speakers_names?: string[];
    documents?: string[];

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}