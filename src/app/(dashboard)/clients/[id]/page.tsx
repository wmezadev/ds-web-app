'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material'

import type { ClientFormFields } from '@/components/clients/ClientForm'
import ClientForm, { clientApiToForm, clientFormToApi } from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'

export default function ClientDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { fetchApi } = useApi()
  const [formData, setFormData] = useState<ClientFormFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Nuevo estado para controlar Snackbar
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadClientData = async () => {
      setLoading(true)
      setError(null)

      try {
        const clientId = Array.isArray(id) ? id[0] : id

        if (!clientId) {
          console.error('Client ID is empty after parsing URL parameters.')
          setError('Client ID is missing.')

          return
        }

        const data: Client = await fetchApi(API_ROUTES.CLIENTS.GET(clientId))

        setFormData(clientApiToForm(data))
      } catch (err: any) {
        console.error('Error al cargar el cliente:', err)
        setError(err?.message || 'No se pudo cargar el cliente.')
      } finally {
        setLoading(false)
      }
    }

    loadClientData()
  }, [id, fetchApi])

  const handleSubmit = useCallback(
    async (values: ClientFormFields) => {
      const clientId = Array.isArray(id) ? id[0] : id

      if (!clientId) {
        console.error('handleSubmit: ID del cliente no disponible para actualizar.')
        alert('DEBUG: No hay ID de cliente para actualizar.')

        return
      }

      try {
        const apiPayload = clientFormToApi(values)

        await fetchApi(API_ROUTES.CLIENTS.UPDATE(clientId), {
          method: 'PUT',
          body: apiPayload,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // Mostrar snackbar
        setShowSuccessSnackbar(true)

        // Esperar 2 segundos antes de redirigir
        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 2000)
      } catch (err: any) {
        console.error('Error al actualizar cliente:', err)
        alert(`DEBUG: Fallo en la actualización: ${err.message}`)
      }
    },
    [id, fetchApi, router]
  )

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

  return (
    <>
      <ClientForm
        key={String(id)}
        mode='edit'
        initialValues={formData}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success' sx={{ width: '100%' }} onClose={() => setShowSuccessSnackbar(false)}>
          Cliente actualizado exitosamente
        </Alert>
      </Snackbar>
    </>
  )
}
