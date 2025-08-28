'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Snackbar,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack
} from '@mui/material'
import { useSession } from 'next-auth/react'

import Alert from '@mui/material/Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import useProfileData from '@/hooks/useProfileData'

interface Document {
  name: string
  url: string
  type: string
  date_uploaded: string
  document_type?: string
  description?: string
  //   expiration_date?: string
  created_at?: string
  user?: string
  user_name?: string
  user_avatar?: string | null
}

interface ClientDocumentsProps {
  client?: any
  refreshClient?: () => Promise<void>
}

const ClientDocuments: React.FC<ClientDocumentsProps> = () => {
  const { data: session } = useSession()
  const { profileData } = useProfileData()
  const currentUserName =
    (session?.user as any)?.name || (profileData as any)?.name || (profileData as any)?.username || '—'
  const currentUserAvatar =
    (session?.user as any)?.image || (profileData as any)?.avatar || (profileData as any)?.image || null
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: 'Contrato_Servicios.pdf',
      url: 'https://example.com/docs/Contrato_Servicios.pdf',
      type: 'PDF',
      date_uploaded: '2025-07-15',
      document_type: 'PDF',
      description: 'Contrato Servicios',
      //   expiration_date: '',
      created_at: '2025-07-15',
      user: '—',
      user_name: '—',
      user_avatar: null
    },
    {
      name: 'Cedula_Representante.jpg',
      url: 'https://example.com/docs/Cedula_Representante.jpg',
      type: 'Imagen',
      date_uploaded: '2025-06-02',
      document_type: 'Imagen',
      description: 'Cedula Representante',
      //
      created_at: '2025-06-02',
      user: '—',
      user_name: '—',
      user_avatar: null
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
    const newDocs: Document[] = files.map(f => {
      const type = getFileType(f)
      const baseName = f.name.replace(/\.[^/.]+$/, '')
      return {
        name: f.name,
        url: URL.createObjectURL(f),
        type,
        date_uploaded: today,
        document_type: type,
        description: baseName,
        // expiration_date: '',
        created_at: today,
        user: currentUserName,
        user_name: currentUserName,
        user_avatar: currentUserAvatar
      }
    })
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
        <Table size='small' sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Formato</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', width: 'calc(100% - 15% - 15% - 22% - 72px)' }}>
                Descripcion
              </TableCell>
              <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Creacion</TableCell>
              <TableCell sx={{ width: '22%', whiteSpace: 'nowrap' }}>Usuario</TableCell>
              <TableCell align='right' sx={{ width: 72, whiteSpace: 'nowrap' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {doc.document_type || doc.type}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {doc.description || doc.name}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.created_at || doc.date_uploaded || '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar src={doc.user_avatar || undefined} sx={{ width: 35, height: 35 }}>
                      {(doc.user_name || doc.user || '—').charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant='body2' noWrap sx={{ maxWidth: 130 }}>
                      {doc.user_name || doc.user || '—'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align='right'>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton size='small' onClick={() => handleViewDocument(doc.url)}>
                      <VisibilityOutlinedIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDeleteDocument(index)}>
                      <DeleteOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Box>
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
