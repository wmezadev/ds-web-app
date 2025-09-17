'use client'
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import type { InsuranceCompanies } from '@/types/insurance-companies'

export function useInsuranceCompanies() {
  const { fetchApi } = useApi()
  const [companies, setCompanies] = useState<InsuranceCompanies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const response = await fetchApi<InsuranceCompanies[]>('admin/insurance_companies')
        setCompanies(response)
      } catch (err) {
        setError('Error al cargar las compañias de seguros')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [fetchApi])

  return { companies, loading, error }
}
