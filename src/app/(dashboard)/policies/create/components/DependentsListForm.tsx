'use client'

import { Control, FieldErrors } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

import ListForm from './ListForm'

interface DependentsFormProps {
  control: Control<PolicyFormInputs>
  errors: FieldErrors<PolicyFormInputs>
}

const DependentsForm = ({ control, errors }: DependentsFormProps) => {
  return <ListForm control={control} errors={errors} type='dependents' />
}

export default DependentsForm
