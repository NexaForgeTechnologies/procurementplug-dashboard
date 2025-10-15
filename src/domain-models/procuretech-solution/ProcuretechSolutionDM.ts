export interface ProcuretechSolutionDM {
    id?: number;
    img?: string;
    name?: string;
    type_id?: number;
    type_name?: string;
    overview?: string;
    key_features?: string[];
    develpment?: string;
    pricing?: string;
    integration?: string;
    snapshots?: string;
    recommended?: string;

    deployment_model_id?: number;
    deployment_model_name?: string;
    integration_model_id?: number;
    integration_model_name?: string;
    pricing_model_id?: number;
    pricing_model_name?: string;
    snapshots_model_id?: number,
    snapshots_model_name?: string,

    procuretech_type_id?: number;
    procuretech_type_name?: string;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}