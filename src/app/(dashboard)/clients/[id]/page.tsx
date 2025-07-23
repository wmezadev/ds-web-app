'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, CircularProgress, Typography } from '@mui/material'

import type { ClientFormFields } from '@/components/clients/ClientForm'
import ClientForm, { clientApiToForm } from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'

export default function ClientDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { fetchApi } = useApi()
  const [formData, setFormData] = useState<ClientFormFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        const data: Client = await fetchApi(API_ROUTES.CLIENTS.GET(id as string))

        setFormData(clientApiToForm(data))
      } catch (err: any) {
        setError(err?.message || 'No se pudo cargar el cliente.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, fetchApi])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando cliente...</Typography>
      </Box>
    )
  }

  if (error) return <Typography color='error'>{error}</Typography>
  if (!formData) return <Typography>No se encontró el cliente.</Typography>

  return <ClientForm key={String(id)} mode='view' initialValues={formData} onCancel={() => router.back()} />
}
