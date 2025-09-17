'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import type { InsuranceLine } from '@/types/insurance-line'

export function useInsuranceLines() {
  const { fetchApi } = useApi()
  const [lines, setLines] = useState<InsuranceLine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLines() {
      try {
        setLoading(true)
        const response = await fetchApi<InsuranceLine[]>('admin/insurance_lines')
        setLines(response)
      } catch (err) {
        setError('Error al cargar los ramos de seguro')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLines()
  }, [fetchApi])

  return { lines, loading, error }
}
