'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import type { Client } from '@/types/client'
import StepperCustomDot from '@/components/stepper-dot'

import ClientInfoFields from './steps/ClientInfoFields'
import ContactFields from './steps/ContactFields'
import PersonalDataFields from './steps/PersonalDataFields'
import ContactListFields from './steps/ContactListFields'
import BankAccountFields from './steps/BankAccountFields'
import RegistrationOptionsFields from './steps/RegistrationOptionsFields'

export type ClientFormFields = {
  id?: string | number
  first_name: string
  last_name: string
  is_member_of_group: string
  client_type: string
  document_number: string
  birth_place: string
  birth_date: string
  join_date: string
  person_type: string
  source: 'C' | 'P'
  email_1: string
  mobile_1: string
  email_2: string
  mobile_2: string
  phone: string
  reference: string
  doc: string
  billing_address?: string
  legal_representative?: string
  economic_activity_id?: string | number | null
  city_id?: string | number | null
  zone_id?: string | number | null
  client_category_id: string | number | null
  office_id: string | number | null
  agent_id?: string | number | null
  executive_id?: string | number | null
  client_group_id?: string | number | null
  client_branch_id?: string | number | null
  notes?: string | null
  personal_data: {
    gender?: string
    civil_status?: string
    height?: number
    weight?: number
    smoker?: boolean
    sports?: string
    profession_id?: string | number | null
    occupation_id?: string | number | null
    monthly_income?: number
    pathology?: string
    rif?: string
  }
  documents?: { type: string; expiration_date: string; status: string; due: boolean; file?: File }[]
  contacts?: {
    full_name: string
    position: string
    phone: string
    email: string
    notes?: string | null
  }[]
  bank_accounts?: any[]
  risk_variables?: any[]
}

const ClientForm: React.FC<Props> = ({
  initialValues = {} as ClientFormFields,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const methods = useForm<ClientFormFields>({
    defaultValues: {
      first_name: initialValues.first_name || '',
      last_name: initialValues.last_name || '',
      is_member_of_group: initialValues.is_member_of_group || '',
      client_type: initialValues.client_type || 'V',
      document_number: initialValues.document_number || '',
      birth_place: initialValues.birth_place || '',
      birth_date: initialValues.birth_date || '',
      join_date:
        initialValues.join_date ||
        (() => {
          const d = new Date()
          const yyyy = d.getFullYear()
          const mm = String(d.getMonth() + 1).padStart(2, '0')
          const dd = String(d.getDate()).padStart(2, '0')

          return `${yyyy}-${mm}-${dd}`
        })(),
      person_type: initialValues.person_type || '',
      source: initialValues.source || 'C',
      email_1: initialValues.email_1 || '',
      mobile_1: initialValues.mobile_1 || '',
      email_2: initialValues.email_2 || '',
      mobile_2: initialValues.mobile_2 || '',
      phone: initialValues.phone || '',
      reference: initialValues.reference || '',
      doc: initialValues.doc || '',
      billing_address: initialValues.billing_address || '',
      legal_representative: initialValues.legal_representative || '',
      city_id: initialValues.city_id || null,
      zone_id: initialValues.zone_id || null,
      economic_activity_id: initialValues.economic_activity_id || null,
      client_category_id: initialValues.client_category_id || null,
      office_id: initialValues.office_id || null,
      agent_id: initialValues.agent_id || null,
      executive_id: initialValues.executive_id || null,
      client_group_id: initialValues.client_group_id || null,
      client_branch_id: initialValues.client_branch_id || null,
      notes: initialValues.notes || '',
      personal_data: initialValues.personal_data || {
        gender: '',
        civil_status: '',
        height: undefined,
        weight: undefined,
        smoker: false,
        sports: '',
        profession_id: null,
        occupation_id: null,
        monthly_income: undefined,
        pathology: '',
        rif: ''
      },
      documents: initialValues.documents || [],
      contacts: initialValues.contacts || [],
      bank_accounts: initialValues.bank_accounts || [],
      risk_variables: initialValues.risk_variables || []
    },
    mode: 'onChange'
  })
  const steps = [
    'Información del Cliente',
    'Datos de Contacto',
    'Datos Personales',
    'Contactos',
    'Cuentas Bancarias',
    'Opciones de Registro'
  ]
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0
  const {
    formState: { isValidating }
  } = methods

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getFieldsForStep = (step: number): (keyof ClientFormFields)[] => {
    switch (step) {
      case 0:
        return ['person_type', 'document_number', 'client_type', 'first_name', 'last_name']
      case 1:
        return ['email_1', 'mobile_1']
      case 2:
        return ['birth_date', 'birth_place']
      case 3:
        return ['email_2', 'mobile_2']
      case 4:
        return []
      case 5:
        return ['client_category_id', 'office_id']
      default:
        return []
    }
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(activeStep)
    const result = await methods.trigger(fieldsToValidate)

    if (result) {
      setCompletedSteps(prev => new Set([...prev, activeStep]))
    }

    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleStepClick = async (step: number) => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      setActiveStep(step)
    }
  }

  const renderStepContent = (step: number) => {
    {
      switch (step) {
        case 0:
          return <ClientInfoFields mode='create' />
        case 1:
          return <ContactFields mode='create' />
        case 2:
          return <PersonalDataFields />
        case 3:
          return <ContactListFields />
        case 4:
          return <BankAccountFields />
        case 5:
          return <RegistrationOptionsFields />
        default:
          return <Typography variant='body2'>[Por agregar]</Typography>
      }
    }
  }

  const handleFinalSubmit = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            Crear nuevo cliente
          </Typography>
          {onCancel && (
            <Button variant='outlined' onClick={onCancel} type='button'>
              Volver
            </Button>
          )}
        </Box>

        <Paper sx={{ p: 4 }}>
          <form noValidate>
            <Stepper
              activeStep={activeStep}
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{
                mb: 4,
                ...(isMobile
                  ? {
                      '& .MuiStepConnector-root': {
                        ml: 1.25,
                        '& .MuiStepConnector-line': {
                          minHeight: '1px'
                        }
                      },
                      '& .MuiStepLabel-root': {
                        paddingLeft: '0px'
                      }
                    }
                  : {})
              }}
            >
              {steps.map((label, index) => (
                <Step key={label} completed={completedSteps.has(index)}>
                  <StepLabel
                    StepIconComponent={StepperCustomDot}
                    onClick={() => handleStepClick(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box
              sx={{
                mt: 4,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box>{renderStepContent(activeStep)}</Box>

              <Box display='flex' justifyContent='space-between' alignItems='center' mt={4}>
                <Stack direction='row' spacing={2} alignItems='center'>
                  {!isFirstStep && (
                    <Button variant='outlined' onClick={handleBack} aria-label='Paso anterior' type='button'>
                      <ArrowBackIcon />
                    </Button>
                  )}

                  {!isLastStep ? (
                    <Button
                      variant='contained'
                      onClick={handleNext}
                      aria-label='Paso siguiente'
                      type='button'
                      disabled={isValidating}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  ) : (
                    <Button type='button' variant='contained' onClick={handleFinalSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Guardando...' : 'Crear Cliente'}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </FormProvider>
  )
}

export const clientApiToForm = (client: Client): ClientFormFields => {
  const formFields: ClientFormFields = {
    first_name: client.first_name ?? '',
    last_name: client.last_name ?? '',
    document_number: client.document_number ?? '',
    client_type: client.client_type ?? '',
    birth_place: client.birth_place ?? '',
    birth_date: client.birth_date ?? '',

    join_date: client.join_date ?? '',
    person_type: client.person_type ?? '',
    source: client.source ?? 'C',
    email_1: client.email_1 ?? '',
    mobile_1: client.mobile_1 ?? '',
    email_2: client.email_2 ?? '',
    mobile_2: client.mobile_2 ?? '',
    phone: client.phone ?? '',
    reference: client.reference ?? '',
    doc: client.doc ?? '',
    is_member_of_group: client.is_member_of_group === true ? 'yes' : '',
    client_category_id: client.client_category_id ?? null,
    office_id: client.office_id ?? null,
    agent_id: client.agent_id ?? null,
    executive_id: client.executive_id ?? null,
    client_group_id: client.client_group_id ?? null,
    client_branch_id: client.client_branch_id ?? null,
    notes: client.notes ?? '',
    contacts: client.contacts,
    documents: client.documents,
    bank_accounts: client.bank_accounts,
    risk_variables: (client as any).risk_variables ?? [],
    id: client.id,
    billing_address: client.billing_address ?? '',
    legal_representative: client.legal_data?.legal_representative ?? '',
    economic_activity_id: client.legal_data?.economic_activity_id ?? null,
    city_id: client.city_id ?? null,
    zone_id: client.zone_id ?? null,
    personal_data: {
      gender: client.personal_data?.gender ?? '',
      civil_status: client.personal_data?.civil_status ?? '',
      height: client.personal_data?.height ?? undefined,
      weight: client.personal_data?.weight ?? undefined,
      smoker: client.personal_data?.smoker ?? false,
      sports: client.personal_data?.sports ?? '',
      profession_id: client.personal_data?.profession_id ?? null,
      occupation_id: client.personal_data?.occupation_id ?? null,
      monthly_income: client.personal_data?.monthly_income ?? undefined,
      pathology: client.personal_data?.pathology ?? '',
      rif: client.personal_data?.rif ?? ''
    }
  }

  return formFields
}

export const clientFormToApi = (formData: ClientFormFields): any => {
  const toNumberOrNull = (value: string | number | null | undefined): number | null => {
    if (value === null || value === undefined || value === '') return null
    const num = typeof value === 'string' ? parseInt(value, 10) : value

    return isNaN(num) ? null : num
  }

  const formatDateForApi = (dateString: string | null | undefined): string | null => {
    if (!dateString || dateString.trim() === '') return null

    try {
      const date = new Date(dateString)

      if (isNaN(date.getTime())) return null

      return date.toISOString().split('T')[0]
    } catch {
      return null
    }
  }

  const validateEmail = (email: string | null | undefined): string | null => {
    if (!email || email.trim() === '') return null

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const cleanEmail = email.trim().toLowerCase()

    return emailRegex.test(cleanEmail) ? cleanEmail : null
  }

  const normalizeStringField = (value: string | null | undefined): string | null => {
    if (value === null || value === undefined) return null
    const trimmed = String(value).trim()

    return trimmed === '' ? null : trimmed
  }

  const genderMap: Record<string, 'M' | 'F'> = {
    M: 'M',
    F: 'F',
    male: 'M',
    female: 'F',
    Masculino: 'M',
    Femenino: 'F'
  }

  const apiData = {
    is_member_of_group: formData.is_member_of_group === 'yes',

    client_type: formData.client_type?.trim() || 'V',
    document_number: formData.document_number?.trim() || '',
    first_name: formData.first_name?.trim() || '',
    last_name: formData.last_name?.trim() || '',
    birth_place: formData.birth_place?.trim() || '',
    birth_date: formatDateForApi(formData.birth_date) || '2025-08-11',
    email_1: validateEmail(formData.email_1) || 'user@example.com',
    email_2: validateEmail(formData.email_2) || 'user@example.com',
    join_date: formatDateForApi(formData.join_date) || '2025-08-11',
    person_type: (formData.person_type?.trim() || 'N') as 'N' | 'J',
    source: ((): 'C' | 'P' => {
      const s = formData.source as any

      if (s === 'C' || s === 'cliente') return 'C'
      if (s === 'P' || s === 'prospecto') return 'P'

      return 'C'
    })(),
    billing_address: formData.billing_address?.trim() || '',
    phone: formData.phone?.trim() || '',
    mobile_1: formData.mobile_1?.trim() || '',
    mobile_2: formData.mobile_2?.trim() || '',
    reference: formData.reference?.trim() || '',
    notes: formData.notes?.trim() || '',

    status: true,

    city_id: toNumberOrNull(formData.city_id),
    zone_id: toNumberOrNull(formData.zone_id),
    client_category_id: toNumberOrNull(formData.client_category_id),
    office_id: toNumberOrNull(formData.office_id),
    agent_id: toNumberOrNull(formData.agent_id),
    executive_id: toNumberOrNull(formData.executive_id),
    client_group_id: toNumberOrNull(formData.client_group_id),
    client_branch_id: toNumberOrNull(formData.client_branch_id),

    personal_data: {
      gender: genderMap[formData.personal_data?.gender || 'M'] || 'M',
      civil_status: formData.personal_data?.civil_status?.trim() || null,
      height: formData.personal_data?.height || 0,
      weight: formData.personal_data?.weight || 0,
      smoker: Boolean(formData.personal_data?.smoker),
      sports: formData.personal_data?.sports?.trim() || '',
      rif: formData.personal_data?.rif?.trim() || '',
      profession_id: toNumberOrNull(formData.personal_data?.profession_id),
      occupation_id: toNumberOrNull(formData.personal_data?.occupation_id),
      monthly_income: formData.personal_data?.monthly_income || 0,
      pathology: formData.personal_data?.pathology?.trim() || ''
    },

    legal_data:
      (formData.person_type?.trim() || 'N') === 'J'
        ? {
            legal_representative: formData.legal_representative?.trim() || '',
            economic_activity_id: toNumberOrNull(formData.economic_activity_id)
          }
        : null,

    contacts: (formData.contacts || [])
      .filter(contact => contact.full_name?.trim() && contact.email?.trim() && contact.phone?.trim())
      .map(contact => ({
        full_name: contact.full_name.trim(),
        position: contact.position?.trim() || '',
        phone: contact.phone.trim(),
        email: validateEmail(contact.email) || contact.email.trim().toLowerCase(),
        notes: contact.notes?.trim() || ''
      })),

    bank_accounts: (formData.bank_accounts || []).map(account => ({
      bank_name: normalizeStringField(account.bank_name),
      account_number: normalizeStringField(account.account_number),
      currency: normalizeStringField(account.currency),
      account_type: normalizeStringField(account.account_type),
      notes: normalizeStringField(account.notes)
    })),

    risk_variables: Array.isArray(formData.risk_variables)
      ? formData.risk_variables.map(v => (typeof v === 'string' ? parseInt(v, 10) : Number(v))).filter(n => !isNaN(n))
      : []
  }

  return apiData
}

export default ClientForm
