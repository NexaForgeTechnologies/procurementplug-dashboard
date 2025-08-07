export interface ConsultantDM {
    id?: number;
    img?: string;
    name?: string;
    email?: string;
    contact?: string;
    designation?: string;
    company?: string;
    overview?: string;
    experties_areas?: string;
    engagement_models?: string;
    clients?: string;
    testimonials?: string;
    // industry_id?: string;
    // industry_name?: string;
    // location?: string;
    // specialism_id?: string;
    // specialism_name?: string;

    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}