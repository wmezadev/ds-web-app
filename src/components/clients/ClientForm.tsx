'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import type { Client } from '@/types/client'
import StepperCustomDot from '@/components/stepper-dot'

import ClientInfoFields from './steps/ClientInfoFields'
import ContactFields from './steps/ContactFields'
import PersonalDataFields from './steps/PersonalDataFields'
import ContactListFields from './steps/ContactListFields'
import DocumentFields from './steps/DocumentFields'
import BankAccountFields from './steps/BankAccountFields'
import RegistrationOptionsFields from './steps/RegistrationOptionsFields'

const steps = [
  'Información del Cliente',
  'Datos de Contacto',
  'Datos Personales',
  'Contactos',
  'Documentos',
  'Cuentas Bancarias',
  'Opciones de Registro'
]

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
  status: string
  source: string
  email_1: string
  mobile_1: string
  email_2: string
  mobile_2: string
  phone: string
  reference: string
  doc: string
  documents?: { type: string; expiration_date: string; status: string; due: boolean }[]
  contacts?: {
    name: string
    last_name: string
    profession: string
    phone: string
    email: string
    observations: string
  }[]
  client_category_id: string | number
  office_id: string | number
  agent_id?: string | number | null
  executive_id?: string | number | null
  client_group_id?: string | number | null
  client_branch_id?: string | number | null
  notes?: string | null
}

const DEFAULT_VALUES: ClientFormFields = {
  id: '',
  first_name: '',
  last_name: '',
  is_member_of_group: '',
  client_type: '',
  document_number: '',
  birth_place: '',
  birth_date: '',
  join_date: '',
  person_type: '',
  status: 'active',
  source: '',
  email_1: '',
  mobile_1: '',
  email_2: '',
  mobile_2: '',
  phone: '',
  reference: '',
  doc: '',
  documents: [],
  contacts: [],
  client_category_id: '',
  office_id: '',
  agent_id: '',
  executive_id: '',
  client_group_id: '',
  client_branch_id: '',
  notes: ''
}

function sanitizeClientFormValues(values: Partial<ClientFormFields>): ClientFormFields {
  return {
    ...DEFAULT_VALUES,
    ...values,
    id: values.id ?? '',
    first_name: values.first_name ?? '',
    last_name: values.last_name ?? '',
    is_member_of_group: values.is_member_of_group ?? '',
    client_type: values.client_type ?? '',
    document_number: values.document_number ?? '',
    birth_place: values.birth_place ?? '',
    birth_date: values.birth_date ?? '',
    join_date: values.join_date ?? '',
    person_type: values.person_type ?? '',
    status: values.status ?? 'active',
    source: values.source ?? '',
    email_1: values.email_1 ?? '',
    mobile_1: values.mobile_1 ?? '',
    email_2: values.email_2 ?? '',
    mobile_2: values.mobile_2 ?? '',
    phone: values.phone ?? '',
    reference: values.reference ?? '',
    doc: values.doc ?? '',
    documents: values.documents ?? [],
    contacts: values.contacts ?? [],
    client_category_id: values.client_category_id ?? '',
    office_id: values.office_id ?? '',
    agent_id: values.agent_id ?? '',
    executive_id: values.executive_id ?? '',
    client_group_id: values.client_group_id ?? '',
    client_branch_id: values.client_branch_id ?? '',
    notes: values.notes ?? ''
  }
}

interface Props {
  mode?: 'create' | 'edit'
  initialValues?: Partial<ClientFormFields>
  onSubmit: (data: ClientFormFields) => void
  onCancel?: () => void
  isSubmitting?: boolean
  submitError?: string | null
}

const ClientForm: React.FC<Props> = ({
  mode = 'create',
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const sanitizedInitialValues = sanitizeClientFormValues(initialValues)

  const methods = useForm<ClientFormFields>({
    defaultValues: sanitizedInitialValues,
    mode: 'onChange'
  })

  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  const getFieldsForStep = (step: number): (keyof ClientFormFields)[] => {
    switch (step) {
      case 0:
        return ['document_number', 'client_type']
      case 1:
        return ['email_1', 'mobile_1']
      case 2:
        return ['birth_date', 'birth_place']
      case 3:
        return ['email_2', 'mobile_2']
      case 4:
        return ['doc']
      case 5:
        return []
      case 6:
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
    if (isLastStep) {
      // Si ya estamos en el último paso, no hacemos nada.
      return
    }

    const isValid = await validateCurrentStep()

    if (isValid) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleStepClick = async (step: number) => {
    const isValid = await validateCurrentStep()

    if (isValid || mode === 'edit') {
      setActiveStep(step)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ClientInfoFields mode={mode} />
      case 1:
        return <ContactFields mode={mode} />
      case 2:
        return <PersonalDataFields />
      case 3:
        return <ContactListFields />
      case 4:
        return <DocumentFields />
      case 5:
        return <BankAccountFields />
      case 6:
        return <RegistrationOptionsFields />
      default:
        return <Typography variant='body2'>[Por agregar]</Typography>
    }
  }

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 4 }}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
          <Stepper activeStep={activeStep} orientation='horizontal' sx={{ mb: 4 }}>
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

            <Box display='flex' justifyContent='flex-end' mt={4}>
              <Stack direction='row' spacing={2} alignItems='center'>
                {onCancel && (
                  <Button variant='outlined' onClick={onCancel} type='button'>
                    Volver
                  </Button>
                )}

                {!isFirstStep && (
                  <Button variant='outlined' onClick={handleBack} aria-label='Paso anterior' type='button'>
                    <ArrowBackIcon />
                  </Button>
                )}

                {!isLastStep ? (
                  <Button variant='contained' onClick={handleNext} aria-label='Paso siguiente' type='button'>
                    <ArrowForwardIcon />
                  </Button>
                ) : (
                  <Button
                    type='button'
                    variant='contained'
                    disabled={isSubmitting}
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </form>
      </Paper>
    </FormProvider>
  )
}

export const clientApiToForm = (client: Client): ClientFormFields => {
  const formFields: ClientFormFields = {
    id: client.id ?? '',
    first_name: client.first_name ?? '',
    last_name: client.last_name ?? '',
    is_member_of_group: client.is_member_of_group === true ? 'yes' : '',
    client_type: client.client_type ?? '',
    document_number: client.document_number ?? '',
    birth_place: client.birth_place ?? '',
    birth_date: client.birth_date ?? '',
    join_date: client.join_date ?? '',
    person_type: client.person_type ?? '',
    status: client.status === true ? 'active' : 'inactive',
    source: client.source ?? '',
    email_1: client.email_1 ?? '',
    mobile_1: client.mobile_1 ?? '',
    email_2: client.email_2 ?? '',
    mobile_2: client.mobile_2 ?? '',
    phone: client.phone ?? '',
    reference: client.reference ?? '',
    doc: '',
    documents: client.documents ?? [],
    contacts: client.contacts ?? [],
    client_category_id: client.client_category_id ?? '',
    office_id: client.office_id ?? '',
    agent_id: client.agent_id ?? null,
    executive_id: client.executive_id ?? null,
    client_group_id: client.client_group_id ?? null,
    client_branch_id: client.client_branch_id ?? null,
    notes: client.notes ?? null
  }

  return formFields
}

export const clientFormToApi = (formData: ClientFormFields): Partial<Client> => {
  const apiData: Partial<Client> = {}

  for (const key in formData) {
    const value = formData[key as keyof ClientFormFields]

    if (key === 'doc' || key === 'documents' || key === 'contacts') {
      continue
    }

    if (key === 'status') {
      apiData.status = value === 'active'
      continue
    }

    if (key === 'is_member_of_group') {
      apiData.is_member_of_group = value === 'yes'
      continue
    }

    const finalValue = value === '' ? null : value

    if (finalValue !== null && finalValue !== undefined) {
      ;(apiData as any)[key] = finalValue
    }
  }

  if (formData.id === '') {
    delete apiData.id
  }

  return apiData
}

export default ClientForm
