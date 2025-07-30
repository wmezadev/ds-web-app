export interface Client {
  id: number | string
  client_type: 'V' | 'J' // V for natural person, J for
  document_number: string
  first_name?: string | null
  last_name?: string | null
  birth_place?: string | null
  birth_date?: string | null
  email_1?: string | null
  email_2?: string | null
  join_date?: string | null
  person_type?: string | null
  status?: boolean | null
  source?: string | null
  billing_address?: string | null
  phone?: string | null
  mobile_1?: string | null
  mobile_2?: string | null
  city_id?: number | string | null
  zone_id?: number | string | null
  reference?: string | null
  client_category_id?: number | string | null
  is_member_of_group?: boolean | null
  office_id?: number | string | null
  agent_id?: number | string | null
  executive_id?: number | string | null
  client_group_id?: number | string | null
  client_branch_id?: number | string | null
  notes?: string | null
  doc?: File | null
}
