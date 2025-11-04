// domain-models/exclusive-partners/ExclusivePartnerDM.ts
export interface ExclusivePartnerDM {
  id: number;
  title: string;
  tagline?: string;
  description?: string;
  logo?: string;
  website?: string;
  category_id?: number; // the numeric foreign key
  category_name?: string; // ✅ add this for display (category name)
}
