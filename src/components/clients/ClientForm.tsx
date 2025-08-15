'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DeleteIcon from '@mui/icons-material/Delete'
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

const getStepsForMode = (mode: 'create' | 'edit') => {
  const baseSteps = ['Información del Cliente', 'Datos de Contacto', 'Datos Personales', 'Contactos']

  if (mode === 'edit') {
    return [...baseSteps, 'Documentos', 'Cuentas Bancarias', 'Opciones de Registro']
  }

  // For create mode, skip Documents step
  return [...baseSteps, 'Cuentas Bancarias', 'Opciones de Registro']
}

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
  onDelete?: (clientId: string | number) => void
  isSubmitting?: boolean
  submitError?: string | null
}

const ClientForm: React.FC<Props> = ({
  mode = 'create',
  initialValues = {} as ClientFormFields,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false
}) => {
  const steps = getStepsForMode(mode)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const methods = useForm<ClientFormFields>({
    defaultValues: {
      ...initialValues,
      first_name: '',
      last_name: '',
      is_member_of_group: '',
      client_type: 'V',
      document_number: '',
      birth_place: '',
      birth_date: '',
      join_date: '',
      person_type: '',
      source: 'C',
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
      documents: [],
      contacts: [],
      bank_accounts: []
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
    if (mode === 'create') {
      // Create mode: no Documents step
      switch (step) {
        case 0:
          return ['person_type', 'document_number', 'client_type']
        case 1:
          return ['email_1', 'mobile_1']
        case 2:
          return ['birth_date', 'birth_place']
        case 3:
          return ['email_2', 'mobile_2']
        case 4: // Bank Accounts (Documents step skipped)
          return []
        case 5: // Registration Options
          return ['client_category_id', 'office_id']
        default:
          return []
      }
    } else {
      // Edit mode: includes Documents step
      switch (step) {
        case 0:
          return ['person_type', 'document_number', 'client_type']
        case 1:
          return ['email_1', 'mobile_1']
        case 2:
          return ['birth_date', 'birth_place']
        case 3:
          return ['email_2', 'mobile_2']
        case 4: // Documents
          return ['doc']
        case 5: // Bank Accounts
          return []
        case 6: // Registration Options
          return ['client_category_id', 'office_id']
        default:
          return []
      }
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
    if (mode === 'create') {
      // Create mode: no Documents step
      switch (step) {
        case 0:
          return <ClientInfoFields mode={mode} />
        case 1:
          return <ContactFields mode={mode} />
        case 2:
          return <PersonalDataFields />
        case 3:
          return <ContactListFields />
        case 4: // Bank Accounts (Documents step skipped)
          return <BankAccountFields />
        case 5: // Registration Options
          return <RegistrationOptionsFields />
        default:
          return <Typography variant='body2'>[Por agregar]</Typography>
      }
    } else {
      // Edit mode: includes Documents step
      switch (step) {
        case 0:
          return <ClientInfoFields mode={mode} />
        case 1:
          return <ContactFields mode={mode} />
        case 2:
          return <PersonalDataFields />
        case 3:
          return <ContactListFields />
        case 4: // Documents
          return <DocumentFields />
        case 5: // Bank Accounts
          return <BankAccountFields />
        case 6: // Registration Options
          return <RegistrationOptionsFields />
        default:
          return <Typography variant='body2'>[Por agregar]</Typography>
      }
    }
  }

  const handleFinalSubmit = () => {
    methods.handleSubmit(onSubmit)()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (onDelete && initialValues?.id) {
      onDelete(initialValues.id)
    }

    setDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
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

            <Box display='flex' justifyContent='space-between' alignItems='center' mt={4}>
              {/* Delete button on the left */}
              <Box>
                {mode === 'edit' && onDelete && initialValues?.id && (
                  <Button
                    variant='outlined'
                    color='error'
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    disabled={isSubmitting}
                    sx={{ minWidth: 120 }}
                  >
                    Eliminar Cliente
                  </Button>
                )}
              </Box>

              {/* Navigation buttons on the right */}
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
                    {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'}
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            ¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.
            {initialValues?.first_name && initialValues?.last_name && (
              <>
                <br />
                <strong>
                  Cliente: {initialValues.first_name} {initialValues.last_name}
                </strong>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
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
    legal_representative: client.legal_data?.legal_representative ?? '',
    economic_activity_id: client.legal_data?.economic_activity_id ?? '',
    city_id: client.city_id ?? '',
    zone_id: client.zone_id ?? '',
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

export const clientFormToApi = (formData: ClientFormFields): any => {
  // Helper function to convert string to number or null
  const toNumberOrNull = (value: string | number | null | undefined): number | null => {
    if (value === null || value === undefined || value === '') return null
    const num = Number(value)

    return isNaN(num) ? null : num
  }

  // Helper function to format date for API (YYYY-MM-DD)
  const formatDateForApi = (dateString: string | null | undefined): string | null => {
    if (!dateString || dateString.trim() === '') return null

    try {
      const date = new Date(dateString)

      if (isNaN(date.getTime())) return null

      return date.toISOString().split('T')[0] // YYYY-MM-DD format
    } catch {
      return null
    }
  }

  // Helper function to validate email
  const validateEmail = (email: string | null | undefined): string | null => {
    if (!email || email.trim() === '') return null

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const cleanEmail = email.trim().toLowerCase()

    return emailRegex.test(cleanEmail) ? cleanEmail : null
  }

  // Build API payload matching EXACT specification
  const apiData = {
    // Boolean fields (exact match)
    is_member_of_group: formData.is_member_of_group === 'yes',

    // String fields (exact match)
    client_type: formData.client_type?.trim() || 'V',
    document_number: formData.document_number?.trim() || '',
    first_name: formData.first_name?.trim() || '',
    last_name: formData.last_name?.trim() || '',
    birth_place: formData.birth_place?.trim() || '',
    birth_date: formatDateForApi(formData.birth_date) || '2025-08-11',
    email_1: validateEmail(formData.email_1) || 'user@example.com',
    email_2: validateEmail(formData.email_2) || 'user@example.com',
    join_date: formatDateForApi(formData.join_date) || '2025-08-11',
    person_type: formData.person_type?.trim() || 'N',
    source: formData.source || 'cliente',
    billing_address: formData.billing_address?.trim() || '',
    phone: formData.phone?.trim() || '',
    mobile_1: formData.mobile_1?.trim() || '',
    mobile_2: formData.mobile_2?.trim() || '',
    reference: formData.reference?.trim() || '',
    notes: formData.notes?.trim() || '',

    // Numeric fields (can be 0 as per API spec)
    city_id: toNumberOrNull(formData.city_id) || 0,
    zone_id: toNumberOrNull(formData.zone_id) || 0,
    client_category_id: toNumberOrNull(formData.client_category_id) || 0,
    office_id: toNumberOrNull(formData.office_id) || 0,
    agent_id: toNumberOrNull(formData.agent_id) || 0,
    executive_id: toNumberOrNull(formData.executive_id) || 0,
    client_group_id: toNumberOrNull(formData.client_group_id) || 0,
    client_branch_id: toNumberOrNull(formData.client_branch_id) || 0,

    // Personal data (exact match to API spec)
    personal_data: {
      gender: formData.personal_data?.gender?.trim() || 'M',
      civil_status: formData.personal_data?.civil_status?.trim() || 'single',
      height: formData.personal_data?.height || 0,
      weight: formData.personal_data?.weight || 0,
      smoker: Boolean(formData.personal_data?.smoker),
      sports: formData.personal_data?.sports?.trim() || '',
      rif: formData.personal_data?.rif?.trim() || '',
      profession_id: toNumberOrNull(formData.personal_data?.profession_id) || 0,
      occupation_id: toNumberOrNull(formData.personal_data?.occupation_id) || 0,
      monthly_income: formData.personal_data?.monthly_income || 0,
      pathology: formData.personal_data?.pathology?.trim() || ''
    },

    // Legal data (exact match to API spec)
    legal_data: {
      legal_representative: formData.legal_representative?.trim() || '',
      economic_activity_id: toNumberOrNull(formData.economic_activity_id) || 0
    },

    // Arrays (exact match to API spec)
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
      bank_name: account.bank_name?.trim() || '',
      account_number: account.account_number?.trim() || '',
      currency: account.currency?.trim() || '',
      account_type: account.account_type?.trim() || '',
      notes: account.notes?.trim() || ''
    })),

    risk_variables: []
  }

  return apiData
}

export default ClientForm
