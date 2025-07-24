import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

interface UsePaginatedResourceOptions {
  endpoint: string // 'clients'
  dataKey: string // 'clients'
  initialPerPage?: number
  enabled?: boolean
  skipParamName?: string
  limitParamName?: string
}

interface RawPaginatedResponse {
  total?: number
  [key: string]: any
}

export function usePaginatedResource<T>({
  endpoint,
  dataKey,
  initialPerPage = 2,
  enabled = true,
  skipParamName = 'skip',
  limitParamName = 'limit'
}: UsePaginatedResourceOptions) {
  const { fetchApi } = useApi()

  // ---- STATE ----
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParamsState] = useState<Record<string, any>>({})

  // Cuando cambian los filtros → reset a page 1
  const setParams = useCallback((newParams: Record<string, any>) => {
    setParamsState(prev => ({ ...prev, ...newParams }))
    setPage(1)
  }, [])

  // ---- FETCH ----
  const runFetch = useCallback(
    async (currentPage: number, currentParams: Record<string, any>) => {
      if (!enabled) return

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()

        // paginación usando skip y limit
        const skip = (currentPage - 1) * perPage

        searchParams.set(skipParamName, String(skip))
        searchParams.set(limitParamName, String(perPage))

        // filtros
        Object.entries(currentParams).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            searchParams.set(k, String(v))
          }
        })

        const url = `${endpoint}?${searchParams.toString()}`

        console.log('[usePaginatedResource] GET', url)

        const raw: RawPaginatedResponse = await fetchApi(url)

        const items = Array.isArray(raw?.[dataKey]) ? (raw[dataKey] as T[]) : []

        const apiTotal = typeof raw.total === 'number' ? raw.total : items.length
        const apiPages = Math.max(1, Math.ceil(apiTotal / perPage))

        setData(items)
        setTotal(apiTotal)
        setTotalPages(apiPages)

        // actualizar página solo si cambió
        if (currentPage !== page) setPage(currentPage)
        if (perPage !== perPage) setPerPage(perPage)
      } catch (err: any) {
        console.error('[usePaginatedResource] fetch error:', err)
        setError(err?.message || 'Error al cargar datos.')
        setData([])
      } finally {
        setLoading(false)
      }
    },
    [fetchApi, enabled, skipParamName, limitParamName, perPage, page, dataKey, endpoint]
  )

  useEffect(() => {
    runFetch(page, params)
  }, [page, perPage, params, enabled, runFetch])

  return {
    data,
    loading,
    error,
    page,
    perPage,
    total,
    totalPages,
    setPage,
    setPerPage,
    setParams,
    refetch: () => runFetch(page, params)
  }
}
