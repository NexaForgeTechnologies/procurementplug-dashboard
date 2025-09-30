import { SelectedSpeaker } from "@/domain-models/speaker/SelectedSpeaker";

export interface EventDM {
    id?: number;
    // Hero section
    event_name?: string;
    event_date?: string;
    collaboration?: string[];
    event_heading?: string;
    heading_detail?: string;
    event_date_time?: string;
    event_location?: string;
    event_designedfor?: string;
    event_ticket?: string;
    event_booking_url?: string;

    // Workshop
    // workshops?: WorkshopSection[];
    workshops?: string

    // Agenda
    agenda?: string;

    // Speakers
    speakers_heading?: string;
    speakers?: SelectedSpeaker[]; // ✅ add this

    // Event Higfhtlight
    event_highlight_detail?: string;
    event_highlight_img?: string[];
    hightlight_heading?: string;
    hightlight_subheading_1?: string;
    hightlight_subdetail_1?: string;
    hightlight_subheading_2?: string;
    hightlight_subdetail_2?: string;

    // Youtube Link
    youtube_link?: string;

    documents?: string[];

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}