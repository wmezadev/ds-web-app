'use client'

import { Control, FieldErrors } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

import ListForm from './ListForm'

interface BeneficiariesFormProps {
  control: Control<PolicyFormInputs>
  errors: FieldErrors<PolicyFormInputs>
}

const BeneficiariesForm = ({ control, errors }: BeneficiariesFormProps) => {
  return <ListForm control={control} errors={errors} type='beneficiaries' />
}

export default BeneficiariesForm
