export interface Policy {
  id?: number | string
  policy_number?: string
  insurance_company?: {
    name?: string
  } | null
  line?: {
    name?: string
  } | null
  insured?: {
    client_type?: 'J' | 'N' | string
    first_name?: string
    last_name?: string
  } | null
  effective_date?: string | null
  expiration_date?: string | null

  nroPoliza?: string
  fecha?: string
  cliente?: string
  ramo?: string
  aseguradora?: string
  vigencia?: string
  estadoGestion?: string
}
