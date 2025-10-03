export interface Coverage {
  id: number
  code: string
  name: string
  line_id: number
  description?: string
  sum_insured?: number | string
  premium?: number | string
  deductible?: number | string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CoveragesListResponse {
  coverages: Coverage[]
  total?: number
  page?: number
  per_page?: number
  pages?: number
}
