'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Paper, Button, Stack } from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

export default function BulkClientCreatePage() {
  const [dragOver, setDragOver] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files || [])

    if (files.length > 0) {
      console.log('Files dropped:', files)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)

    return false
  }

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = Array.from(e.target.files || [])

    if (files.length > 0) {
    }

    if (e.target) {
      e.target.value = ''
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Carga Masiva de Clientes Prueba
      </Typography>

      <Box
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <CloudUploadOutlinedIcon color={dragOver ? 'primary' : 'action'} sx={{ fontSize: 36, mb: 1 }} />
        <Typography variant='body1' sx={{ mb: 0.5 }}>
          Arrastra y suelta tu archivo CSV aquí
        </Typography>
        <Typography variant='caption' color='text.disabled'>
          o haz clic para seleccionar
        </Typography>
        <input
          type='file'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          onClick={e => e.stopPropagation()}
          accept='.csv'
        />
      </Box>

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
                Hola, Tipo de Doc, N° doc, Nombres/Razón social, Apellidos, Lugar de Nac/Fund, Fecha de Nac/Fund, Email
                1, Email 2, Fecha de Ingreso, Tipo de persona, Estado, Dirección, Teléfonos, Ciudad, Zona, Punto de
                referencia
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
                V,12345678,Juan, Pérez, 1985-05-15,M,juan@email.com,5551234,Calle Principal 123,1
                E,87654321,María,Isabel,Rodríguez,López,1990-08-22,F,maria@email.com,5555678,Avenida Central 456,2
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
