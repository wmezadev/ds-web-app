'use client'

import type { Control } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

import ListForm from './ListForm'

interface DependentsFormProps {
  control: Control<PolicyFormInputs>
}

const DependentsForm = ({ control }: DependentsFormProps) => {
  return <ListForm control={control} type='dependents' />
}

export default DependentsForm
