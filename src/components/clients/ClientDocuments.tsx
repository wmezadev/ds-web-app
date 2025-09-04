'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

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
import Alert from '@mui/material/Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'

import useProfileData from '@/hooks/useProfileData'
import { useApi } from '@/hooks/useApi'

interface Document {
  expiring_date: string | undefined
  name: string
  url: string
  s3_key?: string
  type: string
  date_uploaded: string
  document_type?: string
  description?: string
  created_at?: string
  expiry_date?: string
  user?: string
  user_name?: string
  user_avatar?: string | null
}

interface ClientDocumentsProps {
  client?: { id?: string }
  refreshClient?: () => Promise<void>
  onExpiredDocuments?: (docs: Document[]) => void
}

interface UploadMetadata {
  description: string
  expiryDate: Date | null
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client, onExpiredDocuments }) => {
  const { data: session } = useSession()
  const { profileData } = useProfileData()
  const { fetchApi, uploadFile } = useApi()

  const currentUserName =
    (session?.user && 'name' in session.user ? session.user.name : undefined) ||
    (profileData && 'name' in profileData ? profileData.name : undefined) ||
    (profileData && 'username' in profileData ? profileData.username : undefined) ||
    '—'

  const currentUserAvatar =
    (session?.user && 'image' in session.user ? session.user.image : undefined) ||
    (profileData && 'avatar' in profileData ? profileData.avatar : undefined) ||
    (profileData && 'image' in profileData ? profileData.image : undefined) ||
    null

  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success')

  const hasShownExpiredToastRef = useRef(false)

  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const [uploadMetadata, setUploadMetadata] = useState<UploadMetadata>({
    description: '',
    expiryDate: null
  })

  const normalizeDate = (val: unknown): string => {
    if (!val) return ''

    try {
      const d = typeof val === 'string' || typeof val === 'number' ? new Date(val) : new Date(String(val))

      if (isNaN(d.getTime())) return ''

      return d.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  const getExt = (name: string): string => {
    const parts = (name || '').split('.')

    return parts.length > 1 ? parts.pop()!.toUpperCase() : 'FILE'
  }

  const baseName = (name: string): string => name?.replace(/\.[^/.]+$/, '') || ''

  const mapApiToDocuments = useCallback((data: unknown): Document[] => {
    if (!data) return []

    const mapOne = (item: any): Document => {
      const rawUrl: string = item?.url || item?.Location || item?.location || item?.signedUrl || ''
      const url: string = /^https?:\/\//i.test(rawUrl) ? rawUrl : ''

      const key: string = item?.key || item?.Key || item?.s3_key || item?.s3Key || item?.name || ''
      const nameFromUrl = url ? url.split('?')[0].split('/').pop() || '' : ''
      const name = item?.name || item?.original_name || key || nameFromUrl

      const displayType = getExt(name).toString().toUpperCase()

      const created =
        item?.created_at ||
        item?.last_modified ||
        item?.uploaded_at ||
        item?.LastModified ||
        item?.lastModified ||
        item?.date ||
        item?.updated_at

      const createdAt = normalizeDate(created) || normalizeDate(item?.createdAt)

      const userName =
        item?.user_name ||
        item?.created_by_full_name ||
        item?.created_by_username ||
        item?.user ||
        item?.owner?.name ||
        item?.metadata?.uploadedBy ||
        undefined

      return {
        name,
        url: url || '',
        s3_key: key || undefined,
        type: displayType,
        date_uploaded: createdAt || '',
        document_type: displayType,
        description: item?.description || baseName(item?.original_name || name),
        created_at: createdAt || '',
        expiring_date: item?.expiring_date || item?.expiry_date || '',
        user: userName,
        user_name: userName,
        user_avatar: item?.user_avatar || item?.owner?.avatar || null
      }
    }

    let arr: any[] = Array.isArray(data)
      ? (data as any[])
      : Array.isArray((data as any)?.files)
        ? (data as any).files
        : []

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      Array.isArray((data as any).data?.files)
    ) {
      arr = (data as any).data.files
    }

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      Array.isArray((data as any).data?.items)
    ) {
      arr = (data as any).data.items
    }

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      Array.isArray((data as any).data)
    ) {
      arr = (data as any).data
    }

    if (!arr.length && Array.isArray((data as any)?.items)) arr = (data as any).items
    if (!arr.length && Array.isArray((data as any)?.results)) arr = (data as any).results

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'keys' in data &&
      Array.isArray((data as any).keys)
    ) {
      arr = (data as any).keys
    }

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      Array.isArray((data as any).data?.keys)
    ) {
      arr = (data as any).data.keys
    }

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'files' in data &&
      data.files &&
      Array.isArray((data as any).files.keys)
    ) {
      arr = (data as any).files.keys
    }

    if (!arr.length && Array.isArray((data as any)?.Contents)) arr = (data as any).Contents
    if (!arr.length && Array.isArray((data as any)?.['contents'])) arr = (data as any)['contents']

    if (
      !arr.length &&
      typeof data === 'object' &&
      data !== null &&
      'files' in data &&
      typeof (data as any).files === 'object' &&
      (data as any).files !== null &&
      Array.isArray((data as any).files.Contents)
    ) {
      arr = (data as any).files.Contents
    }

    if (Array.isArray(arr) && (arr as any[]).every(x => typeof x === 'string')) {
      return (arr as string[]).map(s => {
        const isUrl = /^https?:\/\//i.test(s)
        const name = s.split('?')[0].split('/').pop() || ''
        const ext = getExt(name)

        return {
          name,
          url: isUrl ? s : '',
          type: ext,
          date_uploaded: '',
          document_type: ext,
          description: baseName(name),
          created_at: '',
          expiring_date: '',
          user: undefined,
          user_name: undefined,
          user_avatar: null
        }
      })
    }

    if (Array.isArray(arr) && arr.length) return arr.map(mapOne)
    if (typeof data === 'object') return [mapOne(data)]

    return []
  }, [])

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true)
      const rawPrefix = `clients/${client?.id}`
      const prefNoSlash = rawPrefix.replace(/\/+$/, '')
      const prefWithSlash = `${prefNoSlash}/`

      const tryFetch = async (basePath: string) => {
        try {
          const data1 = await fetchApi<unknown>(`${basePath}?prefix=${encodeURIComponent(prefNoSlash)}`)
          let mapped = mapApiToDocuments(data1)

          if (!mapped.length) {
            const data2 = await fetchApi<unknown>(`${basePath}?prefix=${encodeURIComponent(prefWithSlash)}`)

            mapped = mapApiToDocuments(data2)
          }

          return mapped
        } catch (err) {
          throw err
        }
      }

      try {
        const mapped = await tryFetch('aws/s3/files')

        setDocuments(mapped)
      } catch (error: any) {
        console.error('Error al cargar documentos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (client?.id) loadDocuments()
  }, [client?.id, fetchApi, mapApiToDocuments])

  useEffect(() => {
    if (loading) return
    if (!documents.length) return
    if (hasShownExpiredToastRef.current) return

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const parseDate = (val?: string) => {
      if (!val) return null
      const d = new Date(val)

      if (isNaN(d.getTime())) return null
      d.setHours(0, 0, 0, 0)

      return d
    }

    const expired = documents.filter(doc => {
      const d = parseDate(doc.expiring_date || (doc as any).expiry_date)

      return d !== null && d < today
    })

    if (expired.length) {
      hasShownExpiredToastRef.current = true
      if (onExpiredDocuments) onExpiredDocuments(expired)
    }
  }, [documents, loading, onExpiredDocuments])

  const uploadAndAddFiles = async (files: File[]) => {
    if (!files || !files.length) return

    setFileToUpload(files[0])
    setUploadMetadata({ description: '', expiryDate: null })
    setUploadModalOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!fileToUpload) return

    setLoading(true)
    setUploadModalOpen(false)

    try {
      const uploadedFile = await uploadFile('aws/s3/upload', fileToUpload, {
        entity: 'clients',
        entity_id: String(client?.id),
        description_type: 'Cedula de identidad',
        description: uploadMetadata.description,
        expiring_date: uploadMetadata.expiryDate ? uploadMetadata.expiryDate.toISOString().split('T')[0] : '',
        is_public: 'false'
      })

      const uploadedUrl =
        (uploadedFile as any).url || (uploadedFile as any).Location || (uploadedFile as any).location || ''

      if (!uploadedUrl) {
        throw new Error('La respuesta de la API no contiene una URL válida.')
      }

      const newDoc: Document = {
        name: uploadMetadata.description || fileToUpload.name,
        url: uploadedUrl,
        s3_key: (uploadedFile as any).key || (uploadedFile as any).s3_key,
        type: fileToUpload.name.split('.').pop()?.toUpperCase() || 'FILE',
        date_uploaded: new Date().toISOString(),
        document_type: fileToUpload.type || 'application/octet-stream',
        description: uploadMetadata.description,
        created_at: new Date().toISOString(),
        expiring_date: uploadMetadata.expiryDate?.toISOString().split('T')[0] || '',
        user: currentUserName,
        user_name: currentUserName,
        user_avatar: currentUserAvatar
      }

      setDocuments(prev => [newDoc, ...prev])

      setSnackbarSeverity('success')
      setSnackbarMessage('Documento subido correctamente')
      setSnackbarOpen(true)
    } catch (saveError: any) {
      setSnackbarSeverity('error')
      setSnackbarMessage(`Error al guardar el documento: ${saveError.message || 'Error desconocido'}`)
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
      setFileToUpload(null)
      setUploadMetadata({ description: '', expiryDate: null })
    }
  }

  const handleCancelUpload = () => {
    setFileToUpload(null)
    setUploadMetadata({ description: '', expiryDate: null })
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

  const handleViewDocument = async (doc: Document) => {
    if (doc.url?.startsWith('blob:')) {
      window.open(doc.url, '_blank', 'noopener,noreferrer')

      return
    }

    if (!doc.s3_key && doc.url) {
      window.open(doc.url, '_blank', 'noopener,noreferrer')

      return
    }

    if (!doc.s3_key) {
      setSnackbarSeverity('error')
      setSnackbarMessage('No se puede mostrar: el documento no tiene s3_key.')
      setSnackbarOpen(true)

      return
    }

    let s3Key = doc.s3_key.trim()

    if (/^https?:\/\//i.test(s3Key)) {
      try {
        const u = new URL(s3Key)

        s3Key = u.pathname.replace(/^\/+/, '')
      } catch {}
    }

    try {
      const resp = await fetchApi<any>('aws/s3/presigned-url', {
        method: 'POST',
        body: {
          s3_key: s3Key
        }
      })

      const finalUrl =
        resp?.url ||
        resp?.presigned_url ||
        resp?.presignedUrl ||
        resp?.signed_url ||
        resp?.signedUrl ||
        resp?.Location ||
        resp?.location ||
        ''

      if (!finalUrl) {
        throw new Error('La respuesta no contiene una URL válida.')
      }

      window.open(finalUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      setSnackbarSeverity('error')
      setSnackbarMessage(`Error al obtener URL firmada: ${err.message || 'Error desconocido'}`)
      setSnackbarOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return

    setDeleteLoading(true)

    try {
      const target = documents[deleteIndex]

      if (!target?.s3_key) {
        setSnackbarSeverity('error')
        setSnackbarMessage('Error: el documento no tiene un identificador único (s3_key).')
        setSnackbarOpen(true)

        return
      }

      const queryParams = new URLSearchParams({
        s3_key: target.s3_key,
        is_public: 'false'
      }).toString()

      await fetchApi(`aws/s3/file?${queryParams}`, {
        method: 'DELETE'
      })
      const updated = documents.filter((_, i) => i !== deleteIndex)

      setDocuments(updated)

      setSnackbarSeverity('success')
      setSnackbarMessage('Documento eliminado exitosamente')
      setSnackbarOpen(true)
    } catch (error: any) {
      setSnackbarSeverity('error')
      setSnackbarMessage(`Error al eliminar documento: ${error.message || 'Error desconocido'}`)
      setSnackbarOpen(true)
    } finally {
      setDeleteLoading(false)
      setDeleteIndex(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteIndex(null)
  }

  useEffect(() => {
    return () => {
      documents.forEach(d => {
        if (d.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(d.url)
          } catch (err) {}
        }
      })
    }
  }, [documents])

  const descriptionOptions = [
    'Cédula de Identidad',
    'Registro Único de Información Fiscal (RIF)',
    'Pasaporte',
    'Visa',
    'Acta de Matrimonio',
    'Acta de Divorcio',
    'Constancia de Union Estable',
    'Certificado Medico',
    'Licencia de Conducir',
    'Recibo de Servicio',
    'Tarjeta de Crédito',
    'Cuenta Bancaria',
    'Partida de Nacimiento',
    'Solicitud del contrato de seguro',
    'Referencia bancaria',
    'Declaración del Impuesto Sobre la Renta (ISLR)',
    'Comprobante de propiedad',
    'Contragarantía en contratos de fianza',
    'Registro de Asociación Gremial',
    'Contrato según actividad del Sujeto Obligado',
    'Acta constitutiva y estatutos sociales',
    'Constancia de verificación de datos RCSNU',
    'Constancia de actualización de datos del cliente',
    'Constancia de verificación de datos por medios públicos'
  ]

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
              <TableRow key={doc.url || doc.name || index}>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={doc.description || doc.name} arrow>
                    <Typography noWrap sx={{ maxWidth: '100%' }}>
                      {doc.description || doc.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {normalizeDate(doc.created_at || doc.date_uploaded) || '—'}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{normalizeDate(doc.expiring_date) || '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Avatar src={doc.user_avatar || undefined} sx={{ width: 35, height: 35 }}>
                      {(doc.user_name || doc.user || '—').charAt(0).toUpperCase()}
                    </Avatar>
                    {/* <Typography variant='body2' noWrap sx={{ maxWidth: 130 }}>
                      {doc.user_name || doc.user || '—'}
                    </Typography> */}
                  </Stack>
                </TableCell>
                <TableCell align='right'>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton size='small' onClick={() => handleViewDocument(doc)}>
                      <VisibilityOutlinedIcon fontSize='small' />
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant='filled'
          sx={{ width: '100%', border: 'none', boxShadow: 'none', borderBottom: 'none' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={deleteIndex !== null} onClose={handleCancelDelete}>
        <DialogTitle>Eliminar documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este documento? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleteLoading}>
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
            options={descriptionOptions}
            value={uploadMetadata.description}
            onChange={(_, newValue) => setUploadMetadata({ ...uploadMetadata, description: newValue || '' })}
            onInputChange={(_, newInputValue) => setUploadMetadata({ ...uploadMetadata, description: newInputValue })}
            renderInput={params => (
              <TextField {...params} margin='dense' label='Descripción' variant='standard' fullWidth />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label='Fecha de Vencimiento'
              value={uploadMetadata.expiryDate}
              onChange={date => setUploadMetadata({ ...uploadMetadata, expiryDate: date })}
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
