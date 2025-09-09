'use client'

import React, { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box } from '@mui/material'

import ClientForm, { clientFormToApi, type ClientFormFields } from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'
import useSnackbar from '@/hooks/useSnackbar'

export default function ClientCreatePage() {
  const router = useRouter()
  const { fetchApi } = useApi()
  const { showSuccess, showError } = useSnackbar()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (formData: ClientFormFields) => {
      setIsSubmitting(true)

      try {
        const apiPayload = clientFormToApi(formData)

        await fetchApi(API_ROUTES.CLIENTS.POST, {
          method: 'POST',
          body: apiPayload,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        showSuccess('Cliente creado exitosamente!')

        setTimeout(() => {
          router.push(ROUTES.CLIENTS.INDEX)
        }, 1500)
      } catch (error: any) {
        console.error('Error creating client:', error)
        showError(`Error al crear el cliente: ${error.message}`)
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchApi, showSuccess, showError, router]
  )

  return (
    <Box>
      <ClientForm mode='create' onSubmit={handleCreate} onCancel={() => router.back()} isSubmitting={isSubmitting} />
    </Box>
  )
}
