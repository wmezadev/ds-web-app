'use client'

import { useState, useEffect } from 'react'

import { useApi } from '@/hooks/useApi'
import type { Vehicle } from '@/types/vehicle'

interface VehicleResponse {
  vehicles: Vehicle[]
  total: number
  page: number
  per_page: number
  pages: number
}

export function useVehicleSearch(query: string, enabled: boolean) {
  const { fetchApi } = useApi()
  const [results, setResults] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  useEffect(() => {
    const controller = new AbortController()

    async function searchVehicles() {
      if (!enabled) {
        setResults([])

        return
      }

      if (debouncedQuery.length > 0 && debouncedQuery.length < 2) {
        setResults([])

        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams({
          page: '1',
          per_page: '100'
        })

        if (debouncedQuery.trim()) {
          searchParams.append('q', debouncedQuery.trim())
        }

        const data = await fetchApi<VehicleResponse | Vehicle[]>(`vehicles?${searchParams.toString()}`, {
          signal: controller.signal
        })

        console.log('Vehicle API Response:', data)

        if (Array.isArray(data)) {
          setResults(data)
        } else {
          setResults(data.vehicles || [])
        }
      } catch (err) {
        if ((err as any).name !== 'AbortError') {
          setError('Error al buscar vehículos')
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }

    searchVehicles()

    return () => controller.abort()
  }, [debouncedQuery, enabled, fetchApi])

  return { results, loading, error }
}
