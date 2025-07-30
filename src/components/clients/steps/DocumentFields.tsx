'use client'

import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const DocumentFields = () => {
  const { watch, setValue } = useFormContext<ClientFormFields>()

  const documents =
    (watch('documents') as { type: string; expiration_date: string; status: string; due: boolean }[]) || []

  const handleAdd = () => {
    setValue('documents', [...documents, { type: '', expiration_date: '', status: '', due: false }])
  }

  const handleDelete = (idx: number) => {
    setValue(
      'documents',
      documents.filter((_, i) => i !== idx)
    )
  }

  // For editing, you may want to open a modal or inline form (not implemented here)

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Documentos
      </Typography>
      {documents.length === 0 ? (
        <Button variant='outlined' onClick={handleAdd}>
          Agregar documento
        </Button>
      ) : (
        <>
          <List>
            {documents.map((doc, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <>
                    {/* <Button size='small' onClick={() => handleEdit(idx)}>Editar</Button> */}
                    <Button size='small' color='error' onClick={() => handleDelete(idx)}>
                      Eliminar
                    </Button>
                  </>
                }
              >
                <ListItemText
                  primary={
                    doc && typeof doc === 'object' && 'type' in doc && 'expiration_date' in doc
                      ? `${doc.type} - Vence: ${doc.expiration_date}`
                      : 'Documento'
                  }
                  secondary={
                    doc && typeof doc === 'object' && 'status' in doc && 'due' in doc
                      ? `Estado: ${doc.status} | Vencido: ${doc.due ? 'Sí' : 'No'}`
                      : ''
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button variant='outlined' onClick={handleAdd}>
            Agregar otro documento
          </Button>
        </>
      )}
    </Box>
  )
}

export default DocumentFields
