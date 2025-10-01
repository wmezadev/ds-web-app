import { useState, useEffect, useCallback } from 'react'

import { useApi } from '@/hooks/useApi'

export interface Model {
  id: number
  name: string
  code: string
}

interface ModelsApiResponse {
  success: boolean
  models: Model[]
  total?: number
  pages?: number
  page?: number
  per_page?: number
}

export function useModels() {
  const { fetchApi } = useApi()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<{ q?: string; brand_id?: number }>({})

  const fetchAllModels = useCallback(
    async (currentParams: { q?: string; brand_id?: number }) => {
      setLoading(true)
      setError(null)

      try {
        let allModels: Model[] = []
        let currentPage = 1
        let hasMorePages = true

        while (hasMorePages) {
          const searchParams = new URLSearchParams()

          searchParams.set('page', String(currentPage))
          searchParams.set('perPage', '100')

          if (currentParams.q) {
            searchParams.set('q', currentParams.q)
          }

          if (currentParams.brand_id) {
            searchParams.set('brand_id', String(currentParams.brand_id))
          }

          const url = `vehicles/models?${searchParams.toString()}`
          const response = await fetchApi<ModelsApiResponse>(url)

          if (response && response.models) {
            allModels = [...allModels, ...response.models]

            if (response.pages && currentPage >= response.pages) {
              hasMorePages = false
            } else if (response.models.length < 100) {
              hasMorePages = false
            } else {
              currentPage++
            }
          } else {
            hasMorePages = false
          }
        }

        setModels(allModels)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los modelos.')
        setModels([])
      } finally {
        setLoading(false)
      }
    },
    [fetchApi]
  )

  useEffect(() => {
    // Solo hacer peticiones si hay un brand_id presente
    if (params.brand_id) {
      fetchAllModels(params)
    } else {
      // Limpiar modelos si no hay brand_id
      setModels([])
      setError(null)
    }
  }, [params, fetchAllModels])

  return {
    data: models,
    loading,
    error,
    setParams
  }
}
