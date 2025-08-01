'use client'

import { useRouter } from 'next/navigation'

// NOTE: Definición del tipo para el formulario.
// Hemos movido la definición del tipo aquí para resolver el error 'Property ... does not exist'.
// Esto asegura que la función clientFormToApi sepa que el formulario tiene campos anidados.
export type ClientFormFields = {
  is_member_of_group: 'yes' | 'no'
  client_type: 'natural_person' | 'legal_person'
  document_number: string
  first_name: string
  last_name: string
  birth_place: string
  birth_date: string
  email_1: string
  email_2?: string
  join_date: string
  person_type: 'N' | 'J'
  status: 'active' | 'inactive'
  source: string
  billing_address: string
  phone: string
  mobile_1: string
  mobile_2?: string
  city_id?: number | null
  zone_id?: number | null
  reference?: string
  client_category_id?: number | null
  office_id?: number | null
  agent_id?: number | null
  executive_id?: number | null
  client_group_id?: number | null
  client_branch_id?: number | null
  notes?: string

  personal_data: {
    gender: 'male' | 'female' | 'other'
    civil_status: 'single' | 'married' | 'divorced' | 'widowed' | 'other'
    height?: number
    weight?: number
    smoker: 'yes' | 'no'
    sports?: string
    rif?: string
    profession_id?: number | null
    occupation_id?: number | null
    monthly_income?: number
    pathology?: string
  }

  legal_data: {
    legal_representative?: string
    economic_activity_id?: number | null
  }

  contacts: Array<{
    full_name: string
    position: string
    phone: string
    email: string
    notes: string
  }>

  bank_accounts: Array<{
    bank_name: string
    account_number: string
    currency: string
    account_type: string
    notes: string
  }>

  id?: number | null
}

import ClientForm from '@/components/clients/ClientForm'
import { useApi } from '@/hooks/useApi'
import { API_ROUTES, ROUTES } from '@/constants/routes'
import type { Client } from '@/types/client'

const clientFormToApi = (formData: ClientFormFields): Partial<Client> => {
  const apiData: Partial<Client> = {
    client_type: formData.client_type === 'natural_person' ? 'N' : 'J',
    person_type: 'N',
    source: formData.source.length > 0 ? formData.source.substring(0, 1) : null,

    document_number: formData.document_number || null,
    first_name: formData.first_name || null,
    last_name: formData.last_name || null,
    birth_place: formData.birth_place || null,
    birth_date: formData.birth_date || null,
    email_1: formData.email_1 || null,
    email_2: formData.email_2 || null,
    join_date: formData.join_date || null,
    billing_address: formData.billing_address || null,
    phone: formData.phone || null,
    mobile_1: formData.mobile_1 || null,
    mobile_2: formData.mobile_2 || null,
    reference: formData.reference || null,
    notes: formData.notes || null,

    is_member_of_group: formData.is_member_of_group === 'yes',
    status: formData.status === 'active',

    city_id: formData.city_id || 0,
    zone_id: formData.zone_id || 0,
    client_category_id: formData.client_category_id || 0,
    office_id: formData.office_id || 0,
    agent_id: formData.agent_id || 0,
    executive_id: formData.executive_id || 0,
    client_group_id: formData.client_group_id || 0,
    client_branch_id: formData.client_branch_id || 0,

    personal_data: {
      gender: formData.personal_data.gender ? formData.personal_data.gender.substring(0, 1) : null,
      civil_status: formData.personal_data.civil_status ? formData.personal_data.civil_status.substring(0, 1) : null,
      height: formData.personal_data.height || null,
      weight: formData.personal_data.weight || null,
      smoker: formData.personal_data.smoker === 'yes',
      sports: formData.personal_data.sports ? formData.personal_data.sports.substring(0, 1) : null,
      rif: formData.personal_data.rif || null,
      profession_id: formData.personal_data.profession_id || 0,
      occupation_id: formData.personal_data.occupation_id || 0,
      monthly_income: formData.personal_data.monthly_income || null,
      pathology: formData.personal_data.pathology ? formData.personal_data.pathology.substring(0, 1) : null
    },

    legal_data: {
      legal_representative: formData.legal_data.legal_representative || null,
      economic_activity_id: formData.legal_data.economic_activity_id || 0
    },

    contacts: formData.contacts.map(contact => ({
      ...contact,
      full_name: contact.full_name || null,
      position: contact.position || null,
      phone: contact.phone || null,
      email: contact.email || null,
      notes: contact.notes || null
    })),
    bank_accounts: formData.bank_accounts.map(bank => ({
      ...bank,
      bank_name: bank.bank_name || null,
      account_number: bank.account_number || null,
      currency: bank.currency || null,
      account_type: bank.account_type || null,
      notes: bank.notes || null
    }))
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
        body: JSON.stringify(apiData)
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
