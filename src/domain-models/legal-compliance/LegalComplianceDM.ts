export interface LegalComplianceDM {
    id?: number;
    img?: string;
    name?: string;
    email?: string;
    contact?: string;
    experties?: string;
    overview?: string;
    experties_areas?: string;
    engagement_models?: string;
    clients?: string;
    testimonials?: string;
    legal_compliance_type_id?: number;
    legal_compliance_type_name?: string;
    industry_id?: number;
    industry_name?: string;
    region_id?: number;
    region_name?: string;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}