import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

export interface CatalogCity {
  id: number
  name: string
}

export interface CatalogAgent {
  id: number
  name: string
}

export interface CatalogOffice {
  id: number
  name: string
}

export interface CatalogZone {
  id: number
  name: string
}

export interface CatalogClientBranch {
  id: number
  name: string
}

export interface CatalogClientCategory {
  id: number
  name: string
}

export interface CatalogClientGroup {
  id: number
  name: string
}

export interface CatalogExecutive {
  id: number
  name: string
}

export interface CatalogRiskVariable {
  id: number
  code: string
  description: string
}

export interface CatalogsResponse {
  agents: CatalogAgent[]
  cities: CatalogCity[]
  client_branches: CatalogClientBranch[]
  client_categories: CatalogClientCategory[]
  client_groups: CatalogClientGroup[]
  executives: CatalogExecutive[]
  offices: CatalogOffice[]
  zones: CatalogZone[]
  risk_variables: CatalogRiskVariable[]
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
      const response: CatalogsResponse = await fetchApi('v1/catalogs')
      
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
    
    refetch: fetchCatalogs,
    
    cities: catalogs?.cities || [],
    agents: catalogs?.agents || [],
    offices: catalogs?.offices || [],
    zones: catalogs?.zones || [],
    clientBranches: catalogs?.client_branches || [],
    clientCategories: catalogs?.client_categories || [],
    clientGroups: catalogs?.client_groups || [],
    executives: catalogs?.executives || [],
    riskVariables: catalogs?.risk_variables || []
  }
}
