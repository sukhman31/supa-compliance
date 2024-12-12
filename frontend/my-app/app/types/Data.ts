export type ProjectData = {
    mfa_user_check: Record<string, boolean>;
    id_to_email_map: Record<string, string>;
    table_rls_check: Record<string, boolean>;
    pitr_check: boolean;
    proj_name: string;
  };
  
export type DataObject = Record<string, ProjectData>;