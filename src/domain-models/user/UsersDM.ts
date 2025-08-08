
export interface UsersDM {
  id?: number;
  name?: string | null;
  email?: string;
  password?: string | undefined;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
