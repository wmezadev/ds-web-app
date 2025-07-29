'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material'

import type { ClientFormFields } from '@/components/clients/ClientForm'
import ClientForm, { clientApiToForm, clientFormToApi } from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { ROUTES, API_ROUTES } from '@/constants/routes'

import type { Client } from '@/types/client'

export default function ClientDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { fetchApi } = useApi()
  const [formData, setFormData] = useState<ClientFormFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadClientData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data: Client = await fetchApi(API_ROUTES.CLIENTS.GET(id as string))

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
      if (!id) {
        console.error('ID del cliente no disponible para actualizar.')

        return
      }

      try {
        setShowSuccess(true)
        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 2500)

        const apiPayload = clientFormToApi(values)

        await fetchApi(API_ROUTES.CLIENTS.UPDATE(id as string), {
          method: 'PUT',
          body: apiPayload,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Cliente actualizado exitosamente!')
        router.push(ROUTES.CLIENTS.INDEX)
      } catch (err: any) {
        console.error('Error al actualizar cliente:', err)
      } finally {
      }
    },
    [id, fetchApi, router] // Dependencias: id del cliente, hook de API, y router
  )

  // --- Renderizado de estados de carga y error ---
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
        key={String(id)} // Importante: fuerza a React a remontar el formulario si el ID del cliente cambia
        mode='edit'
        initialValues={formData}
        onSubmit={handleSubmit} // ¡Aquí pasamos la función para actualizar!
        onCancel={() => router.back()}

        // isSubmitting y submitError no se pasan aquí por ahora
        // isSubmitting={isSubmitting}
        // submitError={submitError}
      />
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity='success' sx={{ width: '100%' }}>
          Cliente actualizado exitosamente
        </Alert>
      </Snackbar>
      {submitError && (
        <Snackbar
          open={!!submitError}
          autoHideDuration={3000}
          onClose={() => setSubmitError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSubmitError(null)} severity='error' sx={{ width: '100%' }}>
            {submitError}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}
