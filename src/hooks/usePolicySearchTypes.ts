import { useEffect, useState } from 'react'

import { useApi } from './useApi'

export interface SearchTypeOption {
  label: string
  value: string
}

export function usePolicySearchTypes(enabled: boolean = true) {
  const { fetchApi } = useApi()
  const [options, setOptions] = useState<SearchTypeOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!enabled) return
      setLoading(true)

      setError(null)

      try {
        const data = await fetchApi<any>('policies/search-types')
        let opts: SearchTypeOption[] = []

        if (data && Array.isArray(data.search_types)) {
          opts = data.search_types.map((t: any) => ({ label: String(t.label ?? t), value: String(t.value ?? t) }))
        } else if (Array.isArray(data)) {
          opts = data
            .map((item: any) => {
              if (typeof item === 'string') return { label: item, value: item }

              if (item && typeof item === 'object') {
                const label = String(item.label ?? item.name ?? item.value ?? '')

                const value = String(item.value ?? item.key ?? item.name ?? label)

                return { label, value }
              }

              return null as unknown as SearchTypeOption
            })
            .filter(Boolean)
        } else if (data && Array.isArray(data?.types)) {
          opts = data.types.map((t: any) => ({ label: String(t.label ?? t), value: String(t.value ?? t) }))
        } else if (data && typeof data === 'object') {
          const entries = Object.entries(data as Record<string, any>)

          if (entries.length) {
            opts = entries.map(([k, v]) => ({ value: String(k), label: String(v ?? k) }))
          }
        }

        if (isMounted) setOptions(opts)
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Error fetching search types')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [enabled, fetchApi])

  return { options, loading, error }
}
