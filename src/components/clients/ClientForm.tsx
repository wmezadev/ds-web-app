'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
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
  const baseSteps = [
    'Información del Cliente',
    'Datos de Contacto',
    'Datos Personales',
    'Contactos'
  ]
  
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
  source: 'cliente' | 'prospecto'
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
  risk_variables?: any[]
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
      first_name: initialValues?.first_name || '',
      last_name: initialValues?.last_name || '',
      is_member_of_group: initialValues?.is_member_of_group || '',
      client_type: initialValues?.client_type || '',
      document_number: initialValues?.document_number || '',
      birth_place: initialValues?.birth_place || '',
      birth_date: initialValues?.birth_date || '',
      join_date: initialValues?.join_date || '',
      person_type: initialValues?.person_type
        ? (initialValues.person_type === 'J' ? 'jurídica' : 'natural')
        : 'natural',
      source: initialValues?.source || 'cliente',
      email_1: initialValues?.email_1 || '',
      mobile_1: initialValues?.mobile_1 || '',
      email_2: initialValues?.email_2 || '',
      mobile_2: initialValues?.mobile_2 || '',
      phone: initialValues?.phone || '',
      reference: initialValues?.reference || '',
      doc: initialValues?.doc || '',
      billing_address: initialValues?.billing_address || '',
      legal_representative: initialValues?.legal_representative || '',
      client_category_id: initialValues?.client_category_id || '',
      office_id: initialValues?.office_id || '',
      agent_id: initialValues?.agent_id || '',
      executive_id: initialValues?.executive_id || '',
      client_group_id: initialValues?.client_group_id || '',
      client_branch_id: initialValues?.client_branch_id || '',
      notes: initialValues?.notes || '',
      personal_data: {
        gender: initialValues?.personal_data?.gender || '',
        civil_status: initialValues?.personal_data?.civil_status || '',
        height: initialValues?.personal_data?.height,
        weight: initialValues?.personal_data?.weight,
        smoker: initialValues?.personal_data?.smoker,
        sports: initialValues?.personal_data?.sports || '',
        profession_id: initialValues?.personal_data?.profession_id || '',
        occupation_id: initialValues?.personal_data?.occupation_id || '',
        monthly_income: initialValues?.personal_data?.monthly_income,
        pathology: initialValues?.personal_data?.pathology || '',
        rif: initialValues?.personal_data?.rif || ''
      },
      documents: initialValues?.documents || [],
      contacts: initialValues?.contacts || [],
      bank_accounts: initialValues?.bank_accounts || []
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
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Header with title and back button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {mode === 'create' ? 'Crear nuevo cliente' : 'Editar cliente'}
          </Typography>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} type="button">
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
              {/* Delete button on the left */}
              <Box>
                {mode === 'edit' && onDelete && initialValues?.id && (
                  <Button
                    variant="outlined"
                    color="error"
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
                    {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente')}
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </form>
      </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.
            {initialValues?.first_name && initialValues?.last_name && (
              <><br /><strong>Cliente: {initialValues.first_name} {initialValues.last_name}</strong></>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  )
}

export const clientApiToForm = (client: Client): ClientFormFields => {
  // Debug logging to see what the API is actually returning
  console.log('API client data received:', JSON.stringify(client, null, 2))
  console.log('API source value:', client.source, 'Type:', typeof client.source)
  
  const formFields: ClientFormFields = {
    first_name: client.first_name ?? '',
    last_name: client.last_name ?? '',
    document_number: client.document_number ?? '',
    client_type: client.client_type ?? '',
    birth_place: client.birth_place ?? '',
    birth_date: client.birth_date ?? '',
    join_date: client.join_date ?? '',
    // Convert API format back to form format
    person_type: client.person_type === 'J' ? 'juridica' : 'natural',
    // Convert API source format back to form format: "C" -> "cliente", "P" -> "prospecto"
    // Handle both API format (C/P) and form format (cliente/prospecto)
    // Handle null/undefined/empty values by defaulting to 'cliente' to match list behavior
    source: (() => {
      if (!client.source || client.source === '' || client.source === null) {
        console.log('Source is null/empty, defaulting to cliente')
        return 'cliente'
      }
      if (client.source === 'P' || client.source === 'prospecto') {
        console.log('Source is prospecto:', client.source)
        return 'prospecto'
      }
      console.log('Source defaulting to cliente for value:', client.source)
      return 'cliente'
    })(),
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
    billing_address: client.billing_address ?? '',
    legal_representative: client.legal_data?.legal_representative ?? '',
    economic_activity_id: client.legal_data?.economic_activity_id ?? '',
    city_id: client.city_id ?? '',
    zone_id: client.zone_id ?? '',
    personal_data: {
      gender: client.personal_data?.gender ?? '',
      civil_status: client.personal_data?.civil_status ?? '',
      height: client.personal_data?.height ?? undefined,
      weight: client.personal_data?.weight ?? undefined,
      smoker: client.personal_data?.smoker ?? false,
      sports: client.personal_data?.sports ?? '',
      profession_id: client.personal_data?.profession_id ?? '',
      occupation_id: client.personal_data?.occupation_id ?? '',
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
    const cleanEmail = email.trim()
    return emailRegex.test(cleanEmail) ? cleanEmail : cleanEmail
  }

  const normalizeStringField = (value: string | null | undefined): string | null => {
    if (!value || value.trim() === '') return null
    return value.trim()
  }

  // Normalize person_type: "natural" -> "N", "juridica" -> "J"
  const normalizedPersonType = formData.person_type === 'juridica' ? 'J' : 'N'

  // Normalize source: "cliente" -> "C", "prospecto" -> "P"
  const normalizedSource = formData.source === 'cliente' ? 'C' : 'P'

  // Ensure is_member_of_group is boolean
  const isMemberOfGroup = formData.is_member_of_group === 'yes' || formData.is_member_of_group === 'true' || formData.is_member_of_group === true

  // Normalize client_type to single character (V, J, G, P)
  const normalizedClientType = normalizeStringField(formData.client_type)

  // legal_data only if person_type is "J" (juridica)
  const legalData = normalizedPersonType === 'J'
    ? {
        legal_representative: normalizeStringField(formData.legal_representative),
        economic_activity_id: toNumberOrNull(formData.economic_activity_id)
      }
    : null

  const apiData = {
    is_member_of_group: isMemberOfGroup,
    status: true,
    client_type: normalizedClientType,
    person_type: normalizedPersonType,
    source: normalizedSource,
    document_number: normalizeStringField(formData.document_number),
    first_name: normalizeStringField(formData.first_name),
    last_name: normalizeStringField(formData.last_name),
    birth_place: normalizeStringField(formData.birth_place),
    billing_address: normalizeStringField(formData.billing_address),
    phone: normalizeStringField(formData.phone),
    mobile_1: normalizeStringField(formData.mobile_1),
    mobile_2: normalizeStringField(formData.mobile_2),
    reference: normalizeStringField(formData.reference),
    notes: normalizeStringField(formData.notes),
    birth_date: formatDateForApi(formData.birth_date),
    join_date: formatDateForApi(formData.join_date),
    email_1: validateEmail(formData.email_1),
    email_2: validateEmail(formData.email_2),
    city_id: toNumberOrNull(formData.city_id),
    zone_id: toNumberOrNull(formData.zone_id),
    client_category_id: toNumberOrNull(formData.client_category_id),
    office_id: toNumberOrNull(formData.office_id),
    agent_id: toNumberOrNull(formData.agent_id),
    executive_id: toNumberOrNull(formData.executive_id),
    client_group_id: toNumberOrNull(formData.client_group_id),
    client_branch_id: toNumberOrNull(formData.client_branch_id),
    personal_data: {
      gender: normalizeStringField(formData.personal_data?.gender),
      civil_status: normalizeStringField(formData.personal_data?.civil_status),
      height: toNumberOrNull(formData.personal_data?.height),
      weight: toNumberOrNull(formData.personal_data?.weight),
      smoker: formData.personal_data?.smoker ?? false,
      sports: normalizeStringField(formData.personal_data?.sports),
      rif: normalizeStringField(formData.personal_data?.rif),
      profession_id: toNumberOrNull(formData.personal_data?.profession_id),
      occupation_id: toNumberOrNull(formData.personal_data?.occupation_id),
      monthly_income: toNumberOrNull(formData.personal_data?.monthly_income),
      pathology: normalizeStringField(formData.personal_data?.pathology)
    },
    legal_data: legalData,
    contacts: (formData.contacts || []).map(contact => ({
      full_name: normalizeStringField(contact.full_name),
      position: normalizeStringField(contact.position),
      phone: normalizeStringField(contact.phone),
      email: validateEmail(contact.email),
      notes: normalizeStringField(contact.notes)
    })),
    bank_accounts: (formData.bank_accounts || []).map(account => ({
      bank_name: normalizeStringField(account.bank_name),
      account_number: normalizeStringField(account.account_number),
      currency: normalizeStringField(account.currency),
      account_type: normalizeStringField(account.account_type),
      notes: normalizeStringField(account.notes)
    })),
    risk_variables: formData.risk_variables || []
  }

  console.log('Form data received:', JSON.stringify(formData, null, 2))
  console.log('API payload being sent:', JSON.stringify(apiData, null, 2))

  return apiData
}



export default ClientForm
