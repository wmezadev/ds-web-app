'use client'

import { Box, Typography, TextField, Button } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { Add } from '@mui/icons-material'

import type { ClientFormFields } from '../ClientForm'

const BankAccountFields = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext<ClientFormFields>()

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <Typography variant='h6' gutterBottom>
        Cuentas Bancarias
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        Esta funcionalidad estará disponible próximamente. Los datos de cuentas bancarias se podrán agregar después de
        crear el cliente.
      </Typography>
      <Button variant='outlined' startIcon={<Add />} disabled fullWidth>
        Agregar Cuenta Bancaria
      </Button>
    </Box>
  )
}

export default BankAccountFields
