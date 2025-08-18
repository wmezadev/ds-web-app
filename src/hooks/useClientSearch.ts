import { useEffect, useState } from 'react'

import type { Client } from '@/types/client'

interface SearchResponse {
  clients: Client[]
  total: number
  page: number
  per_page: number
  pages: number
}

export function useClientSearch(query: string, page: number = 1, perPage: number = 10, enabled: boolean) {
  const [results, setResults] = useState<Client[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setResults([])
      setTotal(0)
      setTotalPages(1)
      
      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const signal = controller.signal

    const searchParams = new URLSearchParams({
      query: query,
      page: page.toString(),
      per_page: perPage.toString()
    })

    fetch(`/api/proxy/clients/search?${searchParams.toString()}`, { signal })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Error en la búsqueda: ${res.statusText}`)
        }

        const data: SearchResponse = await res.json()

        setResults(data.clients || [])
        setTotal(data.total || 0)
        setTotalPages(data.pages || 1)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al buscar clientes')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [query, page, perPage, enabled])

  return { results, total, totalPages, loading, error }
}
