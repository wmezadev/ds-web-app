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
  billing_address?: string
  legal_representative?: string
  economic_activity_id?: string | number
  city_id?: string | number
  zone_id?: string | number
  client_category_id: string | number
  office_id: string | number
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
    profession_id?: string | number
    occupation_id?: string | number
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
}

interface Props {
  mode?: 'create' | 'edit'
  initialValues?: ClientFormFields
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
  const methods = useForm<ClientFormFields>({
    defaultValues: {
      first_name: '',
      last_name: '',
      is_member_of_group: '',
      client_type: '',
      document_number: '',
      birth_place: '',
      birth_date: '',
      join_date: '',
      person_type: '',
      status: '',
      source: '',
      email_1: '',
      mobile_1: '',
      email_2: '',
      mobile_2: '',
      phone: '',
      reference: '',
      doc: '',
      billing_address: '',
      legal_representative: '',
      client_category_id: '', // Se inicializa con una cadena vacía
      office_id: '', // Se inicializa con una cadena vacía
      agent_id: '', // Se inicializa con una cadena vacía
      executive_id: '',
      client_group_id: '',
      client_branch_id: '',
      notes: '',
      personal_data: {
        gender: '',
        civil_status: '',
        height: undefined,
        weight: undefined,
        smoker: undefined,
        sports: '',
        profession_id: '',
        occupation_id: '',
        monthly_income: undefined,
        pathology: '',
        rif: ''
      },
      documents: [],
      contacts: [],
      bank_accounts: [],
      ...initialValues
    },
    mode: 'onChange'
  })

  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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

  const handleFinalSubmit = () => {
    methods.handleSubmit(onSubmit)()
  }

  return (
    <FormProvider {...methods}>
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
                  <Button type='button' variant='contained' onClick={handleFinalSubmit} disabled={isSubmitting}>
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
    first_name: client.first_name ?? '',
    last_name: client.last_name ?? '',
    document_number: client.document_number ?? '',
    client_type: client.client_type ?? '',
    birth_place: client.birth_place ?? '',
    birth_date: client.birth_date ?? '',
    join_date: client.join_date ?? '',
    person_type: client.person_type ?? '',
    source: client.source ?? '',
    email_1: client.email_1 ?? '',
    mobile_1: client.mobile_1 ?? '',
    email_2: client.email_2 ?? '',
    mobile_2: client.mobile_2 ?? '',
    phone: client.phone ?? '',
    reference: client.reference ?? '',
    doc: client.doc ?? '',
    status: client.status === true ? 'active' : 'inactive',
    is_member_of_group: client.is_member_of_group === true ? 'yes' : '',
    client_category_id: client.client_category_id ?? '',
    office_id: client.office_id ?? '',
    agent_id: client.agent_id ?? '',
    executive_id: client.executive_id ?? '',
    client_group_id: client.client_group_id ?? '',
    client_branch_id: client.client_branch_id ?? '',
    notes: client.notes ?? '',
    contacts: client.contacts,
    documents: client.documents,
    bank_accounts: client.bank_accounts,
    id: client.id,
    billing_address: '',
    legal_representative: '',
    economic_activity_id: '',
    city_id: '',
    zone_id: '',
    personal_data: {
      gender: '',
      civil_status: '',
      height: undefined,
      weight: undefined,
      smoker: undefined,
      sports: '',
      profession_id: '',
      occupation_id: '',
      monthly_income: undefined,
      pathology: '',
      rif: ''
    }
  }

  return formFields
}

export const clientFormToApi = (formData: ClientFormFields): Partial<Client> => {
  const apiData: Partial<Client> = {}

  // Handle non-nested fields
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key) && key !== 'personal_data') {
      const value = formData[key as keyof ClientFormFields]

      if (value === '' || value === 0 || (Array.isArray(value) && value.length === 0) || value === undefined) {
        // @ts-ignore
        apiData[key as keyof Client] = null
      } else {
        // @ts-ignore
        apiData[key as keyof Client] = value
      }
    }
  }

  // Handle personal_data nested fields
  if (formData.personal_data) {
    const personalData = formData.personal_data

    apiData.personal_data = {
      gender: personalData.gender || null,
      civil_status: personalData.civil_status || null,
      height: personalData.height || null,
      weight: personalData.weight || null,
      smoker: personalData.smoker || null,
      sports: personalData.sports || null,

      profession_id: personalData.profession_id ? Number(personalData.profession_id) || null : null,
      occupation_id: personalData.occupation_id ? Number(personalData.occupation_id) || null : null,
      monthly_income: personalData.monthly_income || null,
      pathology: personalData.pathology || null,
      rif: personalData.rif || null
    }
  }

  apiData.status = formData.status === 'active'
  apiData.is_member_of_group = formData.is_member_of_group === 'yes'

  if (apiData.id === null || apiData.id === undefined) {
    delete apiData.id
  }

  apiData.contacts = formData.contacts || []
  apiData.documents = formData.documents || []
  apiData.bank_accounts = formData.bank_accounts || []

  return apiData
}

export default ClientForm
