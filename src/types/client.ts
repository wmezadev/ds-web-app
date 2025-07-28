export interface Client {
  id: number
  client_type: string
  document_number: string
  first_name?: string | null
  last_name?: string | null
  birth_place?: string | null
  birth_date?: string | null
  email_1?: string | null
  email_2?: string | null
  join_date?: string | null
  person_type?: string | null
  status: boolean
  source?: string | null
  billing_address?: string | null
  phone?: string | null
  mobile_1?: string | null
  mobile_2?: string | null
  city_id?: number | null
  zone_id?: number | null
  reference?: string | null
  client_category_id?: number | null
  office_id?: number | null
  agent_id?: number | null
  executive_id?: number | null
  client_group_id?: number | null
  client_branch_id?: number | null
  notes?: string | null
  created_at?: string | null
  updated_at?: string | null
  is_deleted?: boolean | null
  deleted_at?: string | null
  created_by?: number | null
  updated_by?: number | null
}
