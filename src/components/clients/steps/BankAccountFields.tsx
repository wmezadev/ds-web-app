'use client'

import { useState } from 'react'

import { Box, Typography, Button, Stack, Grid, TextField, IconButton } from '@mui/material'
import { Add, Close } from '@mui/icons-material'

import { useFieldArray, useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const BankAccountFields = () => {
  const { control, register } = useFormContext<ClientFormFields>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bank_accounts'
  })

  const [] = useState<number | null>(null)

  const handleAddAccount = () => {
    append({
      bank_name: '',
      account_number: '',
      currency: '',
      account_type: '',
      notes: ''
    })
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Cuentas Bancarias</Typography>
        <Button variant='outlined' startIcon={<Add />} onClick={handleAddAccount}>
          Agregar cuenta bancaria
        </Button>
      </Stack>

      {fields.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay cuentas bancarias añadidas aún.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {fields.map((field, index) => (
            <Box
              key={field.id}
              pb={6}
              px={4}
              mt={2}
              sx={{ border: '1px solid #e0e0e0', borderRadius: 2, position: 'relative', pt: 8, boxShadow: 0 }}
            >
              <IconButton
                aria-label='Eliminar cuenta bancaria'
                onClick={() => remove(index)}
                size='small'
                sx={{ position: 'absolute', top: 4, right: 8 }}
                color='error'
              >
                <Close fontSize='small' />
              </IconButton>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label='Banco'
                    placeholder='Nombre del banco'
                    {...register(`bank_accounts.${index}.bank_name`)}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label='Número de cuenta'
                    placeholder='0123-4567-8901-2345'
                    {...register(`bank_accounts.${index}.account_number`)}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label='Tipo de cuenta'
                    placeholder='Ahorro / Corriente'
                    {...register(`bank_accounts.${index}.account_type`)}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label='Moneda'
                    placeholder='USD / EUR / VES'
                    {...register(`bank_accounts.${index}.currency`)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Observaciones'
                    placeholder='Notas adicionales...'
                    {...register(`bank_accounts.${index}.notes`)}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default BankAccountFields
