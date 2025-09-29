import { useState, useEffect, useCallback } from 'react'

import { useApi } from '@/hooks/useApi'

export interface Brand {
  id: number
  name: string
  code: string
}

interface BrandsApiResponse {
  success: boolean
  brands: Brand[]
  total?: number
  pages?: number
  page?: number
  per_page?: number
}

export function useBrands() {
  const { fetchApi } = useApi()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<{ q?: string }>({})

  const fetchAllBrands = useCallback(
    async (currentParams: { q?: string }) => {
      setLoading(true)
      setError(null)

      try {
        let allBrands: Brand[] = []
        let currentPage = 1
        let hasMorePages = true

        while (hasMorePages) {
          const searchParams = new URLSearchParams()

          searchParams.set('page', String(currentPage))
          searchParams.set('perPage', '100')

          if (currentParams.q) {
            searchParams.set('q', currentParams.q)
          }

          const url = `vehicles/brands?${searchParams.toString()}`
          const response = await fetchApi<BrandsApiResponse>(url)

          if (response && response.brands) {
            allBrands = [...allBrands, ...response.brands]

            if (response.pages && currentPage >= response.pages) {
              hasMorePages = false
            } else if (response.brands.length < 100) {
              hasMorePages = false
            } else {
              currentPage++
            }
          } else {
            hasMorePages = false
          }
        }

        setBrands(allBrands)
      } catch (err: any) {
        setError(err.message || 'Error al cargar las marcas.')
        setBrands([])
      } finally {
        setLoading(false)
      }
    },
    [fetchApi]
  )

  useEffect(() => {
    fetchAllBrands(params)
  }, [params, fetchAllBrands])

  return {
    data: brands,
    loading,
    error,
    setParams
  }
}
