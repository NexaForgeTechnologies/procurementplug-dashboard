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
    consultant_type_id?: number;
    consultant_type_name?: string;
    industry_id?: number;
    industry_name?: string;
    location_id?: number;
    location_name?: string;
    specialism_id?: number;
    specialism_name?: string;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}