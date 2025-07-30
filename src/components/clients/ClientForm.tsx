'use client'

import React, { useState } from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Box, Button, Step, StepLabel, Stepper, Typography, Paper, Stack } from '@mui/material'

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

export interface ClientFormFields extends Partial<Client> {}

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
    defaultValues: initialValues,
    mode: 'onChange'
  })

  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(activeStep)

    // For editing mode, don't block progression if fields are empty
    if (mode === 'edit' && fieldsToValidate.length > 0) {
      await methods.trigger(fieldsToValidate)

      // Mark as completed even if validation fails in edit mode
      setCompletedSteps(prev => new Set([...prev, activeStep]))

      return true // Allow progression in edit mode
    }

    const result = await methods.trigger(fieldsToValidate)

    if (result) {
      setCompletedSteps(prev => new Set([...prev, activeStep]))
    }

    return result
  }

  const getFieldsForStep = (step: number): (keyof ClientFormFields)[] => {
    switch (step) {
      case 0: // Client Info
        return ['document_number', 'client_type']
      case 1: // Contact
        return ['email_1', 'mobile_1']
      case 2: // Personal Data
        return ['birth_date', 'birth_place']
      case 3: // Contact List
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

  const handleNext = async () => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const handleStepClick = (step: number) => {
    // Allow navigation to any step when editing existing clients
    if (mode === 'edit') {
      setActiveStep(step)
    } else {
      // For new clients, only allow navigation to completed steps or the next available step
      if (completedSteps.has(step) || step <= activeStep) {
        setActiveStep(step)
      }
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ClientInfoFields mode={mode} />
      case 1:
        return <ContactFields mode={mode} />
      case 2:
        return <PersonalDataFields mode={mode} />
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

  const handleSubmit = async (data: ClientFormFields) => {
    const isValid = await validateCurrentStep()

    if (isValid) {
      onSubmit(data)
    }
  }

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
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

          {/* Step Content */}
          <Box sx={{ mt: 4, minHeight: '300px' }}>
            {renderStepContent(activeStep)}
            <Stack direction='row' spacing={2} sx={{ mt: 3 }}>
              {!isFirstStep && (
                <Button variant='outlined' onClick={handleBack}>
                  Atrás
                </Button>
              )}
              {onCancel && (
                <Button variant='outlined' onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              {!isLastStep ? (
                <Button variant='contained' onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button type='submit' variant='contained' disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
            </Stack>
          </Box>
        </form>
      </Paper>
    </FormProvider>
  )
}

// Helper functions for API conversion
export const clientApiToForm = (client: Client): ClientFormFields => {
  return {
    ...client

    // Add any necessary transformations here
  }
}

export const clientFormToApi = (formData: ClientFormFields): Partial<Client> => {
  return {
    ...formData

    // Add any necessary transformations here
  }
}

export default ClientForm
