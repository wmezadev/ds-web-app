import { useState, useEffect, useCallback } from 'react'

import { useApi } from '@/hooks/useApi'

export interface Model {
  id: number
  name: string
  code: string
}

interface VersionsApiResponse {
  success: boolean
  versions: Model[]
  total?: number
  pages?: number
  page?: number
  per_page?: number
}

export function useVersions() {
  const { fetchApi } = useApi()
  const [versions, setVersions] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<{ q?: string; model_id?: number }>({})

  const fetchAllVersions = useCallback(
    async (currentParams: { q?: string; model_id?: number }) => {
      setLoading(true)
      setError(null)

      try {
        let allVersions: Model[] = []
        let currentPage = 1
        let hasMorePages = true

        while (hasMorePages) {
          const searchParams = new URLSearchParams()

          searchParams.set('page', String(currentPage))
          searchParams.set('perPage', '100')

          if (currentParams.q) {
            searchParams.set('q', currentParams.q)
          }

          if (currentParams.model_id) {
            searchParams.set('model_id', String(currentParams.model_id))
          }

          const url = `vehicles/versions?${searchParams.toString()}`
          const response = await fetchApi<VersionsApiResponse>(url)

          if (response && response.versions) {
            allVersions = [...allVersions, ...response.versions]

            if (response.pages && currentPage >= response.pages) {
              hasMorePages = false
            } else if (response.versions.length < 100) {
              hasMorePages = false
            } else {
              currentPage++
            }
          } else {
            hasMorePages = false
          }
        }

        setVersions(allVersions)
      } catch (err: any) {
        setError(err.message || 'Error al cargar las versiones.')
        setVersions([])
      } finally {
        setLoading(false)
      }
    },
    [fetchApi]
  )

  useEffect(() => {
    fetchAllVersions(params)
  }, [params, fetchAllVersions])

  return {
    data: versions,
    loading,
    error,
    setParams
  }
}
