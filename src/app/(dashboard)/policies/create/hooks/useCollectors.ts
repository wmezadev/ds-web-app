'use client'

import { useState, useEffect } from 'react'

import { useApi } from '@/hooks/useApi'
import type { Collector } from '@/types/collector'

export function useCollectors() {
  const { fetchApi } = useApi()
  const [collectors, setCollectors] = useState<Collector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollectors() {
      try {
        setLoading(true)
        const response = await fetchApi<Collector[]>('catalogs/collectors')

        setCollectors(response)
      } catch (err) {
        setError('Error al cargar los cobradores')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollectors()
  }, [fetchApi])

  return { collectors, loading, error }
}
