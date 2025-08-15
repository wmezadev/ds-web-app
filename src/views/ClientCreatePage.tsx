'use client'

import React, { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Typography, Alert, Snackbar } from '@mui/material'

import ClientForm, { clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'

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
    async (formData: ClientFormFields) => {
      setIsSubmitting(true)
      setSnackbar(prev => ({ ...prev, open: false }))

      try {
        // Convert form data to API format
        const apiPayload = clientFormToApi(formData)
        
        // Debug: Log the payload being sent to API
        console.log('DEBUG: Creating client with payload:', JSON.stringify(apiPayload, null, 2))

        // Make API call to create client
        await fetchApi(API_ROUTES.CLIENTS.POST, {
          method: 'POST',
          body: apiPayload,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        setSnackbar({
          open: true,
          message: 'Cliente creado exitosamente!',
          severity: 'success'
        })

        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 1500)
      } catch (error: any) {
        console.error('Error creating client:', error)
        
        // Debug: Log detailed error information
        console.log('DEBUG: Error details:', {
          message: error.message,
          status: error.status,
          response: error.response,
          stack: error.stack,
          fullError: error
        })
        
        setSnackbar({
          open: true,
          message: `Error al crear el cliente: ${error.message}`,
          severity: 'error'
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [router, fetchApi]
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
