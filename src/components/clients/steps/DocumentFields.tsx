import { useRef, useEffect } from 'react'

import { Box, Button, Typography, Stack, Grid, IconButton, Tooltip, TextField } from '@mui/material'
import { Add, Delete, UploadFile, CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
import { useFormContext, useFieldArray } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const DocumentFields = () => {
  const { control, register, setValue, watch } = useFormContext<ClientFormFields>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents'
  })

  const documents = watch('documents') || []

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    fileInputRefs.current = Array(fields.length)
      .fill(null)
      .map((_, i) => fileInputRefs.current[i] || null)
  }, [fields.length])

  const handleAdd = () => {
    append({ type: '', expiration_date: '', status: '', due: false })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]

    if (file) {
      setValue(`documents.${index}.file`, file)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Documentos</Typography>
        <Button variant='outlined' onClick={handleAdd} startIcon={<Add />}>
          Añadir documento
        </Button>
      </Stack>

      {fields.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay documentos añadidos aún.
        </Typography>
      ) : (
        <Stack spacing={3}>
          {fields.map((item, index) => {
            const doc = documents[index]

            return (
              <Box key={item.id}>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label='Tipo de documento'
                      placeholder='Ej: Cédula, Pasaporte...'
                      {...register(`documents.${index}.type`)}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label='Fecha de vencimiento'
                      type='date'
                      InputLabelProps={{ shrink: true }}
                      {...register(`documents.${index}.expiration_date`)}
                    />
                  </Grid>

                  {/* <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      label='Estado'
                      placeholder='Ej: vigente, caducado...'
                      {...register(`documents.${index}.status`)}
                    />
                  </Grid> */}

                  {/* Ícono de estado vencido */}
                  <Grid item xs={2} md={1}>
                    <Tooltip title={doc?.due ? 'Documento vencido' : 'Documento vigente'}>
                      {doc?.due ? <ErrorIcon color='error' /> : <CheckCircle color='success' />}
                    </Tooltip>
                  </Grid>

                  {/* Ícono de subir archivo */}
                  <Grid item xs={2} md={1}>
                    <input
                      type='file'
                      accept='.pdf'
                      hidden
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      onChange={e => handleFileChange(e, index)}
                    />
                    <Tooltip title='Subir archivo'>
                      <IconButton onClick={() => fileInputRefs.current[index]?.click()}>
                        <UploadFile />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  {/* Eliminar documento */}
                  <Grid item xs={2} md={1}>
                    <IconButton onClick={() => remove(index)} color='error'>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}

export default DocumentFields
