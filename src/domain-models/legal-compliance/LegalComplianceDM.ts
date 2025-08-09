export interface LegalComplianceDM {
    id?: number;
    img?: string;
    name?: string;
    email?: string;
    contact?: string;
    experties?: string;
    overview?: string;
    jurisdictional_coverage?: string;
    company_logo?: string[];
    practice_areas?: string;
    services?: string[];
    sample_templates?: string[];

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