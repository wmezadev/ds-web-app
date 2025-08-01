export type Client = {
  id: string | number
  first_name?: string | null
  last_name?: string | null
  is_member_of_group?: boolean
  client_type?: string | null
  document_number?: string | null
  birth_place?: string | null
  birth_date?: string | null
  join_date?: string | null
  person_type?: string | null
  status?: boolean
  source?: string | null
  email_1?: string | null
  mobile_1?: string | null
  email_2?: string | null
  mobile_2?: string | null
  phone?: string | null
  reference?: string | null
  notes?: string | null
  client_category_id?: string | number | null
  office_id?: string | number | null
  agent_id?: string | number | null
  executive_id?: string | number | null
  client_group_id?: string | number | null
  client_branch_id?: string | number | null
  documents?: { type: string; expiration_date: string; status: string; due: boolean }[] | null
  contacts?:
    | {
        name: string
        last_name: string
        profession: string
        phone: string
        email: string
        observations: string
      }[]
    | null
}
