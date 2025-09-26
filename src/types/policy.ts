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

export type PaymentMode = 'O' | 'I'
export type PolicyModality = 'I' | 'C'
export type PolicyStatus = 'A' | 'C' | 'E'

export const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string }[] = [
  { value: 'O', label: 'Pago Único' },
  { value: 'I', label: 'Fraccionado' }
]

export const POLICY_MODALITY_OPTIONS: { value: PolicyModality; label: string }[] = [
  { value: 'I', label: 'Individual' },
  { value: 'C', label: 'Colectiva' }
]

export const POLICY_STATUS_OPTIONS: { value: PolicyStatus; label: string }[] = [
  { value: 'A', label: 'Vigente' },
  { value: 'C', label: 'Anulada' },
  { value: 'E', label: 'Vencida' }
]

export interface PolicyFormInputs {
  id?: number
  policy_number: string
  holder_id: number | null
  insured_id: number | null
  insurance_company_id: number | null
  policy_modality: PolicyModality
  line_id: number | null
  status: PolicyStatus
  is_new: boolean
  issue_date: string
  effective_date: string
  expiration_date: string
  policy_period: number | null
  is_renewable: boolean
  has_co_insurance: boolean
  payment_mode: PaymentMode
  insured_interest: string
  collector_id: number | null
  vehicle_id: number | null
}
