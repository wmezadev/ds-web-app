import { useState, useEffect } from 'react'
import { useApi } from './useApi'

interface FollowUpType {
  id: number
  name: string
}

interface UseFollowUpTypesReturn {
  followUpTypes: FollowUpType[]
  loading: boolean
  error: string | null
}

export const useFollowUpTypes = (): UseFollowUpTypesReturn => {
  const [followUpTypes, setFollowUpTypes] = useState<FollowUpType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi } = useApi()

  useEffect(() => {
    const fetchFollowUpTypes = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchApi('follow-up-types')
        const data = response.data || response.follow_up_types || response || []
        setFollowUpTypes(data)

      } catch (err) {
        setError('Error al cargar los tipos de gestión')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowUpTypes()

  }, [fetchApi])

  return { followUpTypes, loading, error }
}
