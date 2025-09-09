'use client'

import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Autocomplete
} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { useSession } from 'next-auth/react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

import { useApi } from '@/hooks/useApi'
import { useSnackbar } from '@/hooks/useSnackbar'
import { getFileIconClass } from '@/utils/fileHandlers'
import { FILE_DESCRIPTION_OPTIONS } from '@/constants/texts'
import { isExpired, dateToYearMonthDay, strToDayMonthYear } from '@/utils/dates'
import type { S3File, S3FilesResponse, S3FileUploadResponse, UploadFileForm } from '@/types/files'

interface ClientDocumentsProps {
  client?: { id?: string }
  refreshClient?: () => Promise<void>
  onExpiredDocuments?: (docs: S3File[]) => void
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client, onExpiredDocuments }) => {
  const { data: session } = useSession()
  const { fetchApi, uploadFile } = useApi()
  const { showSuccess, showError } = useSnackbar()

  const [documents, setDocuments] = useState<S3File[]>([])

  const [loading, setLoading] = useState(false)

  const hasShownExpiredToastRef = useRef(false)

  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const [uploadFileForm, setUploadFileForm] = useState<UploadFileForm>({ description: '' })

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        if (!client?.id) throw new Error('Client ID not set')
        setLoading(true)

        const resp = await fetchApi<S3FilesResponse>(`aws/s3/files?prefix=clients/${client.id}`)

        if (!resp.success) throw new Error('Error uploading to S3 file: ' + resp.error)

        setDocuments(resp.files)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [client?.id, fetchApi])

  useEffect(() => {
    if (loading) return
    if (!documents.length) return
    if (hasShownExpiredToastRef.current) return

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const expired = documents.filter(doc => isExpired(doc.expiring_date))

    if (expired.length) hasShownExpiredToastRef.current = true
    if (onExpiredDocuments) onExpiredDocuments(expired)
  }, [documents, loading, onExpiredDocuments])

  const uploadAndAddFiles = async (files: File[]) => {
    if (!files || !files.length) return

    setFileToUpload(files[0])
    setUploadModalOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!fileToUpload) return

    try {
      setLoading(true)
      setUploadModalOpen(false)

      const resp = await uploadFile<S3FileUploadResponse>('aws/s3/upload', fileToUpload, {
        entity: 'clients',
        entity_id: String(client?.id),
        description: uploadFileForm.description,
        expiring_date: uploadFileForm?.expiring_date ? dateToYearMonthDay(uploadFileForm.expiring_date) : '',
        is_public: 'false'
      })

      if (!resp.success || !resp?.file?.key) {
        throw new Error('La respuesta de la API no contiene una key válida.')
      }

      const tempFile: S3File = {
        ...resp.file,
        created_at: new Date().toISOString(),
        created_by_username: session?.user.username,
        created_by_avatar: session?.user.username
      }

      setDocuments(prev => [...prev, tempFile])
      showSuccess('Documento subido correctamente')
    } catch (error) {
      showError(`Error al subir el documento: ${error || 'Error desconocido'}`)
    } finally {
      setLoading(false)
      setFileToUpload(null)
      setUploadFileForm({ description: '' })
    }
  }

  const handleCancelUpload = () => {
    setFileToUpload(null)
    setUploadFileForm({ description: '' })
    setUploadModalOpen(false)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files || [])

    if (files.length > 0) {
      uploadAndAddFiles(files)
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
      uploadAndAddFiles(files)
    }

    if (e.target) {
      e.target.value = ''
    }
  }

  const handleViewDocument = async (doc: S3File) => {
    try {
      if (doc.is_public && doc.url) {
        window.open(doc.url, '_blank', 'noopener,noreferrer')

        return
      }

      if (!doc.is_public && !doc.key) throw new Error('No se puede mostrar: el documento no tiene key.')

      const resp = await fetchApi<{ url: string }>('aws/s3/presigned-url', {
        method: 'POST',
        body: {
          s3_key: doc.key
        }
      })

      if (!resp.url) throw new Error('La respuesta no contiene una URL válida.')

      window.open(resp.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      showError(`Error al obtener URL firmada: ${err || 'Error desconocido'}`)
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return

    setDeleteLoading(true)

    try {
      const target = documents[deleteIndex]

      if (!target?.key) {
        showError('Error: el documento no tiene un identificador único (key).')

        return
      }

      const queryParams = new URLSearchParams({
        s3_key: target.key,
        is_public: 'false'
      }).toString()

      await fetchApi(`aws/s3/file?${queryParams}`, {
        method: 'DELETE'
      })
      const updated = documents.filter((_, i) => i !== deleteIndex)

      setDocuments(updated)

      showSuccess('Documento eliminado exitosamente')
    } catch (error: any) {
      showError(`Error al eliminar documento: ${error.message || 'Error desconocido'}`)
    } finally {
      setDeleteLoading(false)
      setDeleteIndex(null)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6' fontWeight='bold'>
          Documentos
        </Typography>
      </Box>

      <div style={{ width: '100%' }}>
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
            Arrastra y suelta archivos aquí
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
            multiple
          />
        </Box>
      </div>

      {loading ? (
        <Typography variant='body2' color='text.secondary'>
          Cargando documentos…
        </Typography>
      ) : documents.length === 0 ? (
        <Typography variant='body2' color='text.secondary'>
          No hay documentos registrados.
        </Typography>
      ) : (
        <Table
          size='small'
          sx={{
            tableLayout: 'fixed',
            '& .MuiTableCell-root': {
              py: 0.5,
              px: 0.75
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  whiteSpace: 'nowrap',
                  width: 'calc(100% - 15% - 15% - 20% - 72px)'
                }}
              >
                Descripción
              </TableCell>
              <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Creación</TableCell>
              <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Vencimiento</TableCell>
              <TableCell sx={{ width: '10%', whiteSpace: 'nowrap' }}>Usuario</TableCell>
              <TableCell align='right' sx={{ width: 72, whiteSpace: 'nowrap' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={doc.file_id || index}>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={doc.description || doc.original_name} arrow>
                    <Typography noWrap sx={{ maxWidth: '100%' }}>
                      {doc.description || doc.original_name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{strToDayMonthYear(doc.created_at)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{strToDayMonthYear(doc.expiring_date)}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar src={doc?.created_by_avatar} sx={{ width: 35, height: 35 }}>
                      {(doc.created_by_username || '—').charAt(0).toUpperCase()}
                    </Avatar>
                  </Stack>
                </TableCell>
                <TableCell align='right'>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton size='small' onClick={() => handleViewDocument(doc)}>
                      <i className={getFileIconClass(doc.file_type)}></i>
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => setDeleteIndex(index)}>
                      <DeleteOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Eliminar documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este documento? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained' disabled={deleteLoading}>
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={uploadModalOpen} onClose={handleCancelUpload} fullWidth maxWidth='sm'>
        <DialogTitle>Detalles del documento</DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese la descripción y fecha de vencimiento del documento.</DialogContentText>
          <Autocomplete
            freeSolo
            options={FILE_DESCRIPTION_OPTIONS}
            value={uploadFileForm.description}
            onChange={(_, newValue) => setUploadFileForm({ ...uploadFileForm, description: newValue || '' })}
            onInputChange={(_, newInputValue) => setUploadFileForm({ ...uploadFileForm, description: newInputValue })}
            renderInput={params => (
              <TextField {...params} margin='dense' label='Descripción' variant='standard' fullWidth />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label='Fecha de Vencimiento'
              value={uploadFileForm.expiring_date}
              format='dd-MM-yyyy'
              onChange={pickerValue =>
                setUploadFileForm({ ...uploadFileForm, expiring_date: pickerValue === null ? undefined : pickerValue })
              }
              slotProps={{
                textField: {
                  margin: 'dense',
                  fullWidth: true,
                  variant: 'standard'
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload}>Cancelar</Button>
          <Button onClick={handleConfirmUpload} variant='contained'>
            Subir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ClientDocuments
