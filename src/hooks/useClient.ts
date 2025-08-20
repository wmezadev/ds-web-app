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

interface FollowUpRecord {
  id: number
  subject: string
  reminder_date: string
  description: string
  assigned_to: number
  assigned_by: number
  type_id: number
  status: boolean
  created_at?: string
  updated_at?: string
  assigned_to_name?: string
  assigned_by_name?: string
  type_name?: string
}

interface UseClientReturn {
  data: Client | null
  followUpTypes: FollowUpType[]
  followUpRecords: FollowUpRecord[]
  isLoading: boolean
  error: string | null
  createFollowUp: (followUpData: Omit<FollowUpRecord, 'id' | 'created_at' | 'updated_at'>) => Promise<FollowUpRecord>
  updateFollowUpStatus: (followUpId: number, status: boolean) => Promise<void>
  refreshFollowUps: () => Promise<void>
}

export const useClient = (clientId: string): UseClientReturn => {
  const [data, setData] = useState<Client | null>(null)
  const [followUpTypes, setFollowUpTypes] = useState<FollowUpType[]>([])
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([])
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

        // Fetch client data, follow-up types, and follow-up records in parallel
        const [clientResponse, followUpTypesResponse, followUpRecordsResponse] = await Promise.all([
          fetchApi(`clients/${clientId}`),
          fetchApi('follow-up-types'),
          fetchApi(`clients/${clientId}/follow-up`)
        ])

        const clientData = clientResponse.data || clientResponse.client || clientResponse
        const followUpTypesData =
          followUpTypesResponse.data || followUpTypesResponse.follow_up_types || followUpTypesResponse || []
        const followUpRecordsData =
          followUpRecordsResponse.data || followUpRecordsResponse.follow_ups || followUpRecordsResponse || []

        setData(clientData)
        setFollowUpTypes(followUpTypesData)
        setFollowUpRecords(followUpRecordsData)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos')
        setData(null)
        setFollowUpTypes([])
        setFollowUpRecords([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clientId, fetchApi])

  const createFollowUp = async (
    followUpData: Omit<FollowUpRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<FollowUpRecord> => {
    try {
      const response = await fetchApi(`clients/${clientId}/follow-up`, {
        method: 'POST',
        body: followUpData
      })

      const newFollowUp = response.data || response.follow_up || response

      // Add the new follow-up to the local state
      setFollowUpRecords(prev => [newFollowUp, ...prev])

      return newFollowUp
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear el seguimiento')
    }
  }

  const updateFollowUpStatus = async (followUpId: number, status: boolean): Promise<void> => {
    try {
      await fetchApi(`clients/${clientId}/follow-up/${followUpId}/status`, {
        method: 'PATCH',
        body: { status }
      })

      setFollowUpRecords(prev =>
        prev.map(record => {
          if (record.id === followUpId) {
            return { ...record, status: status }
          } else if (status) {
            // If the current follow-up is being activated, deactivate all others
            return { ...record, status: false }
          }
          return record
        })
      )
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar el estado del seguimiento')
    }
  }

  const refreshFollowUps = async (): Promise<void> => {
    try {
      const response = await fetchApi(`clients/${clientId}/follow-up`)
      const followUpRecordsData = response.data || response.follow_ups || response || []
      setFollowUpRecords(followUpRecordsData)
    } catch (err: any) {
      console.error('Error refreshing follow-ups:', err)
    }
  }

  return {
    data,
    followUpTypes,
    followUpRecords,
    isLoading,
    error,
    createFollowUp,
    refreshFollowUps,
    updateFollowUpStatus
  }
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
