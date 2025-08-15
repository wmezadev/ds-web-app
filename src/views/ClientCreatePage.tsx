'use client'

import React, { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, Alert, Snackbar } from '@mui/material'

import ClientForm from '@/components/clients/ClientForm'
import { ROUTES } from '@/constants/routes'

export default function ClientCreatePage() {
  const router = useRouter()

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async () => {
      setIsSubmitting(true)
      setSnackbar(prev => ({ ...prev, open: false }))

      try {
        // TODO: Implement actual client creation logic
        setSnackbar({
          open: true,
          message: 'Cliente creado exitosamente!',
          severity: 'success'
        })

        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 1500)
      } catch (error: any) {
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
    [router]
  )

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <Box>
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
