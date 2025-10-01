'use client'

import type { Control } from 'react-hook-form'

import type { PolicyFormInputs } from '@/types/policy'

import ListForm from './ListForm'

interface BeneficiariesFormProps {
  control: Control<PolicyFormInputs>
}

const BeneficiariesForm = ({ control }: BeneficiariesFormProps) => {
  return <ListForm control={control} type='beneficiaries' />
}

export default BeneficiariesForm
