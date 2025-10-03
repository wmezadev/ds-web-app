'use client'

import { useState, useEffect } from 'react'

import { useApi } from '@/hooks/useApi'
import type { Coverage } from '@/types/coverage'

interface UseInsuranceCoveragesOptions {
  insuranceLineId: number | null
  enabled?: boolean
}

export function useInsuranceCoverages({ insuranceLineId, enabled = true }: UseInsuranceCoveragesOptions) {
  const { fetchApi } = useApi()
  const [coverages, setCoverages] = useState<Coverage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCoverages() {
      if (!insuranceLineId || !enabled) {
        setCoverages([])

        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetchApi<Coverage[]>(`admin/insurance_coverages?line_id=${insuranceLineId}`)

        setCoverages(Array.isArray(response) ? response : [])
      } catch (err) {
        setError('Error al cargar las coberturas')
        console.error(err)
        setCoverages([])
      } finally {
        setLoading(false)
      }
    }

    fetchCoverages()
  }, [fetchApi, insuranceLineId, enabled])

  return { coverages, loading, error }
}
