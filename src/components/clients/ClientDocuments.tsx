'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Snackbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

import Alert from '@mui/material/Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

interface Document {
  name: string
  url: string
  type: string
  date_uploaded: string
}

interface ClientDocumentsProps {
  client?: any
  refreshClient?: () => Promise<void>
}

const ClientDocuments: React.FC<ClientDocumentsProps> = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: 'Contrato_Servicios.pdf',
      url: 'https://example.com/docs/Contrato_Servicios.pdf',
      type: 'PDF',
      date_uploaded: '2025-07-15'
    },
    {
      name: 'Cedula_Representante.jpg',
      url: 'https://example.com/docs/Cedula_Representante.jpg',
      type: 'Imagen',
      date_uploaded: '2025-06-02'
    },
    {
      name: 'RIF_Empresa.png',
      url: 'https://example.com/docs/RIF_Empresa.png',
      type: 'Imagen',
      date_uploaded: '2025-05-20'
    }
  ])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (file: File) => {
    if (file.type) return file.type.split('/').pop()?.toUpperCase() || 'FILE'
    const parts = file.name.split('.')
    return parts.length > 1 ? parts.pop()!.toUpperCase() : 'FILE'
  }

  const addFiles = (files: File[]) => {
    if (!files || files.length === 0) return
    const today = new Date().toISOString().split('T')[0]
    const newDocs: Document[] = files.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type: getFileType(f),
      date_uploaded: today
    }))
    setDocuments(prev => [...newDocs, ...prev])
    setSnackbarSeverity('success')
    setSnackbarMessage(`${files.length} archivo(s) agregado(s)`)
    setSnackbarOpen(true)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files || [])
    addFiles(files)
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank')
  }

  const handleDeleteDocument = (index: number) => {
    const target = documents[index]
    if (target && target.url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(target.url)
      } catch {}
    }
    const updated = documents.filter((_, i) => i !== index)
    setDocuments(updated)
    setSnackbarSeverity('success')
    setSnackbarMessage('Documento eliminado exitosamente')
    setSnackbarOpen(true)
  }

  useEffect(() => {
    return () => {
      documents.forEach(d => {
        if (d.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(d.url)
          } catch {}
        }
      })
    }
  }, [documents])

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Documentos
        </Typography>
      </Box>

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          bgcolor: dragOver ? 'primary.lightOpacity' : 'background.paper',
          color: 'text.secondary',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3
        }}
      >
        <CloudUploadOutlinedIcon color={dragOver ? 'primary' : 'action'} sx={{ fontSize: 36, mb: 1 }} />
        <Typography variant='body1' sx={{ mb: 0.5 }}>
          Arrastra y suelta archivos aquí
        </Typography>
        <Typography variant='caption' color='text.disabled'>
          o haz clic para seleccionar
        </Typography>
        <input
          ref={fileInputRef}
          type='file'
          multiple
          hidden
          onChange={e => {
            const files = Array.from(e.target.files || [])
            addFiles(files)
            if (fileInputRef.current) fileInputRef.current.value = ''
          }}
        />
      </Box>

      {documents.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay documentos registrados.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Archivo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha de Subida</TableCell>
              <TableCell align='right'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display='flex' alignItems='center'>
                    <DescriptionOutlinedIcon color='action' sx={{ mr: 1 }} />
                    {doc.name}
                  </Box>
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.date_uploaded}</TableCell>
                <TableCell align='right'>
                  <IconButton size='small' onClick={() => handleViewDocument(doc.url)}>
                    <VisibilityOutlinedIcon fontSize='small' />
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => handleDeleteDocument(index)}>
                    <DeleteOutlinedIcon fontSize='small' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ClientDocuments
