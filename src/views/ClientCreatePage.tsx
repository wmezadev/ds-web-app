'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Alert, Snackbar } from '@mui/material'

import ClientForm, { clientFormToApi } from '@/components/clients/ClientForm'
import { API_ROUTES, ROUTES } from '@/constants/routes'
import { useApi } from '@/hooks/useApi'

export default function ClientCreatePage() {
  const router = useRouter()
  const { fetchApi } = useApi()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (values: any) => {
      setIsSubmitting(true)
      setSnackbar({ ...snackbar, open: false })

      const apiPayload = clientFormToApi(values)

      // Log para depuración
      console.log('Enviando los siguientes datos a la API:', apiPayload)

      try {
        const newClient = await fetchApi(API_ROUTES.CLIENTS.POST, {
          method: 'POST',
          body: apiPayload
        })

        console.log('Cliente creado con éxito:', newClient)

        setSnackbar({
          open: true,
          message: 'Cliente creado exitosamente!',
          severity: 'success'
        })

        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 1500)
      } catch (error: any) {
        console.error('Error in handleCreate:', error)

        // Manejo de errores más genérico y robusto
        setSnackbar({
          open: true,
          message: `Error al crear el cliente: ${error.message}`,
          severity: 'error'
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchApi, router]
  )

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 600 }}>
        Crear nuevo cliente
      </Typography>

      <ClientForm mode='create' onSubmit={handleCreate} onCancel={() => router.back()} isSubmitting={isSubmitting} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
