'use client'

import { Box, Grid, IconButton, Stack, TextField, Typography, Button } from '@mui/material'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Add, Delete } from '@mui/icons-material'

const ContactListFields = () => {
  const { control, register } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  })

  return (
    <Box>
      {/* Título y botón en la misma fila */}
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Contactos</Typography>
        <Button
          startIcon={<Add />}
          variant='outlined'
          onClick={() =>
            append({
              name: '',
              last_name: '',
              profession: '',
              phone: '',
              email: '',
              observations: ''
            })
          }
        >
          Añadir contacto
        </Button>
      </Stack>

      {fields.map((field, index) => (
        <Box key={field.id} mb={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label='Nombre' placeholder='Juan' {...register(`contacts.${index}.name`)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label='Apellido' placeholder='Pérez' {...register(`contacts.${index}.last_name`)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label='Profesión'
                placeholder='Ingeniero'
                {...register(`contacts.${index}.profession`)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField fullWidth label='Teléfono' placeholder='+58...' {...register(`contacts.${index}.phone`)} />
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center' gap={2}>
                <TextField
                  label='Email'
                  placeholder='ejemplo@correo.com'
                  {...register(`contacts.${index}.email`)}
                  sx={{ flexBasis: '25%' }}
                />
                <TextField
                  label='Observaciones'
                  placeholder='Detalles relevantes...'
                  {...register(`contacts.${index}.observations`)}
                  sx={{ flexGrow: 1 }}
                />
                <IconButton onClick={() => remove(index)} color='error'>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  )
}

export default ContactListFields
