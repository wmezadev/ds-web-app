import { useState, useEffect, useCallback } from 'react'

import { useApi } from './useApi'

interface UsePaginatedResourceOptions {
  endpoint: string // 'clients'
  dataKey: string // 'clients'
  initialPerPage?: number
  enabled?: boolean
}

interface RawPaginatedResponse {
  total: number
  page: number
  per_page: number
  pages: number
  [key: string]: any
}

export function usePaginatedResource<T>({
  endpoint,
  dataKey,
  initialPerPage = 2,
  enabled = true
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
    setParamsState(prev => {
      // Usar JSON.stringify para comparar objetos si son complejos y evitar renderizados innecesarios
      if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...newParams })) {
        return prev
      }

      return { ...prev, ...newParams }
    })
    setPage(1) // Siempre resetear a la página 1 cuando los parámetros cambian
  }, [])

  // ---- FETCH ----
  const runFetch = useCallback(
    async (currentPage: number, currentPerPage: number, currentParams: Record<string, any>) => {
      // Añade currentPerPage aquí
      if (!enabled) return

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()

        // paginación usando page y per_page
        searchParams.set('page', String(currentPage))
        searchParams.set('per_page', String(currentPerPage))

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

        // Use the pagination data directly from the API response
        const apiTotal = raw.total || 0
        const apiPages = raw.pages || 1

        setData(items)
        setTotal(apiTotal)
        setTotalPages(apiPages)

        // IMPORTANTE: NO LLAMAR A setPage o setPerPage aquí si sus valores no son diferentes
        // Y aún mejor, si ya los pasas como argumentos al runFetch, no necesitas actualizar el estado interno
        // aquí, ya que el estado que provocó esta ejecución ya es la "fuente de verdad"
      } catch (err: any) {
        console.error('[usePaginatedResource] fetch error:', err)
        setError(err?.message || 'Error al cargar datos.')
        setData([])
      } finally {
        setLoading(false)
      }
    },
    [fetchApi, enabled, dataKey, endpoint] // Remueve page y perPage de las dependencias
  )

  // useEffect que dispara la petición
  useEffect(() => {
    // Si enabled es false, no disparamos la petición
    if (!enabled) return

    // Ejecuta la búsqueda cuando 'page', 'perPage', 'params' o 'enabled' cambian
    // runFetch ahora recibe estos como argumentos
    runFetch(page, perPage, params)
  }, [page, perPage, params, enabled, runFetch]) // Las dependencias del useEffect son correctas ahora

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

    // Asegúrate de que refetch llame a runFetch con los estados actuales
    refetch: useCallback(() => runFetch(page, perPage, params), [runFetch, page, perPage, params])
  }
}
