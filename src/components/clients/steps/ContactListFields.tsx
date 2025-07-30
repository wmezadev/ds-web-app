'use client'

import { Box, Button, Typography, List, ListItem, ListItemText } from '@mui/material'
import { useFormContext } from 'react-hook-form'

import type { ClientFormFields } from '../ClientForm'

const ContactListFields = () => {
  const { watch, setValue } = useFormContext<ClientFormFields>()
  const contacts = watch('contacts') || []

  const handleAdd = () => {
    setValue('contacts', [
      ...contacts,
      { name: '', last_name: '', profession: '', phone: '', email: '', observations: '' }
    ])
  }

  const handleDelete = (idx: number) => {
    setValue(
      'contacts',
      contacts.filter((_, i) => i !== idx)
    )
  }

  // For editing, you may want to open a modal or inline form (not implemented here)

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Contactos
      </Typography>
      {contacts.length === 0 ? (
        <Button variant='outlined' onClick={handleAdd}>
          Agregar contacto
        </Button>
      ) : (
        <>
          <List>
            {contacts.map((contact, idx) => (
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
                  primary={`${contact.name} ${contact.last_name} - ${contact.profession}`}
                  secondary={`Tel: ${contact.phone} | Email: ${contact.email} | Obs: ${contact.observations}`}
                />
              </ListItem>
            ))}
          </List>
          <Button variant='outlined' onClick={handleAdd}>
            Agregar otro contacto
          </Button>
        </>
      )}
    </Box>
  )
}

export default ContactListFields
