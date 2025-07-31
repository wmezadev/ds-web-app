'use client'

import { useRouter } from 'next/navigation'

import type { ClientFormFields } from '@/components/clients/ClientForm'
import ClientForm from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'

export default function ClientCreatePage() {
  const router = useRouter()
  const { fetchApi } = useApi()

  const handleCreate = async (values: ClientFormFields) => {
    await fetchApi(API_ROUTES.CLIENTS.POST, {
      method: 'POST',
      body: values
    })
    router.push(ROUTES.CLIENTS.INDEX)
  }

  return <ClientForm mode='create' onSubmit={handleCreate} onCancel={() => router.back()} />
}
