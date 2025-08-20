import { useState, useEffect } from 'react'
import { useApi } from './useApi'
import type { Client } from '@/types/client'

interface FollowUpType {
  id: number
  name: string
}

interface UseFollowUpTypesReturn {
  followUpTypes: FollowUpType[]
  loading: boolean
  error: string | null
}

interface UseClientReturn {
  data: Client | null
  followUpTypes: FollowUpType[]
  isLoading: boolean
  error: string | null
}

export const useClient = (clientId: string): UseClientReturn => {
  const [data, setData] = useState<Client | null>(null)
  const [followUpTypes, setFollowUpTypes] = useState<FollowUpType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi } = useApi()

  useEffect(() => {
    if (!clientId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch both client data and follow-up types in parallel
        const [clientResponse, followUpTypesResponse] = await Promise.all([
          fetchApi(`clients/${clientId}`),
          fetchApi('follow-up-types')
        ])
        
        const clientData = clientResponse.data || clientResponse.client || clientResponse
        const followUpTypesData = followUpTypesResponse.data || followUpTypesResponse.follow_up_types || followUpTypesResponse || []
        
        setData(clientData)
        setFollowUpTypes(followUpTypesData)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos')
        setData(null)
        setFollowUpTypes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clientId, fetchApi])

  return { data, followUpTypes, isLoading, error }
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
