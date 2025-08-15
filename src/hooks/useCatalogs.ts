import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

interface BaseClientEntity {
  id: number
  name: string
}
export interface CatalogRiskVariable {
  id: number
  code: string
  description: string
}

export interface CatalogsResponse {
  agents: BaseClientEntity[]
  business_activities: BaseClientEntity[]
  cities: BaseClientEntity[]
  client_branches: BaseClientEntity[]
  client_categories: BaseClientEntity[]
  client_groups: BaseClientEntity[]
  client_occupations: BaseClientEntity[]
  client_professions: BaseClientEntity[]
  executives: BaseClientEntity[]
  offices: BaseClientEntity[]
  risk_variables: BaseClientEntity[]
  zones: CatalogRiskVariable[]
}

export function useCatalogs(enabled = true) {
  const { fetchApi } = useApi()

  const [catalogs, setCatalogs] = useState<CatalogsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCatalogs = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response: CatalogsResponse = await fetchApi('catalogs')

      setCatalogs(response)
    } catch (err: any) {
      setError(err?.message || 'Error al cargar catálogos.')
      setCatalogs(null)
    } finally {
      setLoading(false)
    }
  }, [fetchApi, enabled])

  useEffect(() => {
    if (enabled) {
      fetchCatalogs()
    }
  }, [enabled, fetchCatalogs])

  return {
    catalogs,
    loading,
    error,
    refetch: fetchCatalogs
  }
}
