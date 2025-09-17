'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import type { Client } from '@/types/client'

// Asumimos que la respuesta de la API de búsqueda es un array de clientes.
// Si tiene paginación, necesitaríamos ajustar la interfaz.
// La respuesta de la API es paginada
interface SearchResponse {
  clients: Client[]
  total: number
  page: number
  per_page: number
  pages: number
}

export function useClientSearch(query: string, enabled: boolean) {
  const { fetchApi } = useApi()
  const [results, setResults] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce para el input del usuario
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms de espera

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  // Efecto para llamar a la API
  useEffect(() => {
    const controller = new AbortController()

    async function searchClients() {
      // No buscar si no está habilitado o si el query (después del debounce) está vacío
      // Si no está habilitado, no hacemos nada.
      if (!enabled) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams({
          q: debouncedQuery,
          page: '1', // Siempre buscamos en la primera página
          perPage: '100' // Pedimos hasta 100 resultados
        })

        const data = await fetchApi<SearchResponse>(`clients/search?${searchParams.toString()}`, {
          signal: controller.signal
        })

        setResults(data.clients || [])
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          setError('Error al buscar clientes')
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }

    searchClients()

    return () => controller.abort()
  }, [debouncedQuery, enabled, fetchApi])

  return { results, loading, error }
}
