'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Paper, Button, Stack } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'

export default function BulkClientCreatePage() {
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop here
  }, [])

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Carga Masiva de Clientes
      </Typography>

      <Paper
        elevation={isDragging ? 8 : 2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          textAlign: 'center',
          mb: 4,
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <CloudUploadIcon color={isDragging ? 'primary' : 'action'} sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant='h6' gutterBottom>
          Arrastra y suelta tu archivo CSV aquí
        </Typography>
        <Typography variant='body2' color='text.secondary' paragraph>
          O haz clic para seleccionar un archivo
        </Typography>
        <Button variant='contained' component='label' startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
          Seleccionar archivo
          <input type='file' hidden accept='.csv' />
        </Button>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h5' gutterBottom>
          Instrucciones
        </Typography>

        <Stack spacing={2} mt={2}>
          <Box>
            <Typography variant='subtitle1' fontWeight='medium'>
              1. Prepara tu archivo
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Asegúrate de que tu archivo CSV contenga las siguientes columnas:
            </Typography>
            <Paper
              variant='outlined'
              sx={{
                p: 2,
                mt: 1,
                bgcolor: 'background.default',
                overflowX: 'auto'
              }}
            >
              <Typography component='pre' sx={{ m: 0, fontFamily: 'monospace' }}>
                tipo_documento,documento,primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,fecha_nacimiento,genero,email,telefono,direccion,ciudad_id
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography variant='subtitle1' fontWeight='medium'>
              2. Formato de datos
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              - Fechas deben estar en formato YYYY-MM-DD - Los campos de género deben ser M o F - El ciudad_id debe
              coincidir con un ID existente en el sistema
            </Typography>
          </Box>

          <Box>
            <Typography variant='subtitle1' fontWeight='medium'>
              3. Ejemplo de datos
            </Typography>
            <Paper
              variant='outlined'
              sx={{
                p: 2,
                mt: 1,
                bgcolor: 'background.default',
                overflowX: 'auto'
              }}
            >
              <Typography component='pre' sx={{ m: 0, fontFamily: 'monospace' }}>
                V,12345678,Juan,Carlos,Pérez,González,1985-05-15,M,juan@email.com,5551234,Calle Principal 123,1
                E,87654321,María,Isabel,Rodríguez,López,1990-08-22,F,maria@email.com,5555678,Avenida Central 456,2
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
