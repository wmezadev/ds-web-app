'use client'

import { useRouter } from 'next/navigation'

import type { ClientFormFields } from '@/components/clients/ClientForm'
import ClientForm from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'

// Moved the function here to avoid import issues
const clientFormToApi = (formData: ClientFormFields): Partial<Client> => {
  const apiData: Partial<Client> = {}

  for (const key in formData) {
    const value = formData[key as keyof ClientFormFields]

    if (key === 'status') {
      apiData[key] = (value === 'active') as any
      continue
    }

    if (key === 'is_member_of_group') {
      apiData[key] = (value === 'yes') as any
      continue
    }

    const finalValue = value === '' ? null : value

    if (finalValue !== null && finalValue !== undefined && finalValue !== '') {
      ;(apiData as any)[key] = finalValue
    }
  }

  if (formData.id === '') {
    delete apiData.id
  }

  return apiData
}

export default function ClientCreatePage() {
  const router = useRouter()
  const { fetchApi } = useApi()

  const handleCreate = async (values: ClientFormFields) => {
    console.log('✅ El formulario se ha enviado. Procesa los datos...')

    const apiData = clientFormToApi(values)

    try {
      console.log('✅ Datos enviados desde formulario:', apiData)

      const response = await fetchApi(API_ROUTES.CLIENTS.POST, {
        method: 'POST',
        body: apiData
      })

      if (!response.ok) {
        console.error('❌ Error al guardar cliente', await response.json())

        return
      }

      router.push(ROUTES.CLIENTS.INDEX)
    } catch (error) {
      console.error('🔥 Error inesperado:', error)
    }
  }

  return <ClientForm mode='create' onSubmit={handleCreate} onCancel={() => router.back()} />
}
