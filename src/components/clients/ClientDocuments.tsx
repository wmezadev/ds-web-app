// ClientDocuments.tsx
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
  Card,
  CardContent
} from '@mui/material'
import { useSession } from 'next-auth/react'

import Alert from '@mui/material/Alert'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

import { useApi } from '@/hooks/useApi'
import useProfileData from '@/hooks/useProfileData'

interface Document {
  name: string
  url: string
  type: string
  date_uploaded: string
  document_type?: string
  description?: string
  created_at?: string
  user?: string
  user_name?: string
  user_avatar?: string | null
}

interface ClientDocumentsProps {
  client?: { id?: string } // Specify shape for client
  refreshClient?: () => Promise<void>
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client, refreshClient }) => {
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

  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      const key: string = item?.key || item?.Key || item?.name || ''
      const nameFromUrl = url ? url.split('?')[0].split('/').pop() || '' : ''
      const name = item?.name || item?.original_name || key || nameFromUrl

      const type = (
        item?.type ||
        item?.file_type ||
        item?.contentType ||
        item?.ContentType ||
        item?.file_extension ||
        getExt(name)
      )
        .toString()
        .toUpperCase()

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
        type,
        date_uploaded: createdAt || '',
        document_type: type,
        description: item?.description || baseName(item?.original_name || name),
        created_at: createdAt || '',
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
    if (!arr.length && Array.isArray(data?.contents)) arr = data.contents
    if (!arr.length && Array.isArray(data?.files?.Contents)) arr = data.files.Contents

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
  }, [client?.id, fetchApi, mapApiToDocuments]) // Add all referenced functions/vars

  const uploadAndAddFiles = async (files: File[]) => {
    if (!files || !files.length) {
      return
    }

    setLoading(true)

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const file of files) {
      try {
        const tempDoc: Document = {
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type || 'application/octet-stream',
          date_uploaded: new Date().toISOString(),
          document_type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          description: file.name,
          created_at: new Date().toISOString(),
          user: currentUserName,
          user_name: currentUserName,
          user_avatar: currentUserAvatar
        }

        setDocuments(prev => [tempDoc, ...prev])

        const uploadedFile = await uploadFile('aws/s3/upload', file, {
          entity: 'clients',
          entity_id: String(client?.id),
          description_type: 'Cedula de identidad',
          description: 'cedula de la hija del cliente para prueba',
          is_public: 'false'
        })

        try {
          const documentData = {
            type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
            description: file.name,
            url: (uploadedFile as any).url || (uploadedFile as any).Location || (uploadedFile as any).location || '',
            size: file.size,
            content_type: file.type || 'application/octet-stream',
            uploaded_by: currentUserName,
            uploaded_at: new Date().toISOString()
          }

          const currentClient = await fetchApi(`clients/${client?.id}`)

          await fetchApi(`clients/${client?.id}`, {
            method: 'PUT',
            body: {
              ...(typeof currentClient === 'object' && currentClient !== null ? currentClient : {}),
              documents: [
                ...(typeof currentClient === 'object' &&
                currentClient !== null &&
                Array.isArray((currentClient as { documents?: any[] }).documents)
                  ? (currentClient as { documents?: any[] }).documents!
                  : []),
                documentData
              ]
            }
          })

          successCount++
        } catch (saveError: any) {
          errorCount++
          errors.push(`Error al guardar la referencia del documento: ${saveError.message || 'Error desconocido'}`)
        }
      } catch (error: any) {
        errorCount++
        errors.push(`${file.name}: ${error.message || 'Error desconocido'}`)
      }
    }

    setLoading(false)

    if (successCount > 0 && refreshClient) {
      try {
        await refreshClient()
      } catch (error) {
        errors.push('Error al actualizar la lista de documentos')
      }
    }

    let message = ''

    if (successCount > 0 && errorCount === 0) {
      setSnackbarSeverity('success')
      message = `Se subieron correctamente ${successCount} archivo(s)`
    } else if (errorCount > 0 && successCount === 0) {
      setSnackbarSeverity('error')
      message = `Error al subir ${errorCount} archivo(s): ${errors.join('; ')}`
    } else if (errorCount > 0) {
      setSnackbarSeverity('warning')
      message = `Se subieron ${successCount} archivo(s), pero fallaron ${errorCount}: ${errors.join('; ')}`
    }

    setSnackbarMessage(message)
    setSnackbarOpen(true)
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

    // Reset the input to allow selecting the same file again
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleDeleteDocument = (index: number) => {
    const target = documents[index]

    if (target && target.url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(target.url)
      } catch (err) {
        // Optionally log error
      }
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
          } catch (err) {
            // Log error for debugging
            // console.error('Error revoking object URL:', err);
          }
        }
      })
    }
  }, [documents]) // Depend on documents

  return (
    <Card>
      <CardContent>
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
          <Table size='small' sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Formato</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', width: 'calc(100% - 15% - 15% - 22% - 72px)' }}>
                  Descripción
                </TableCell>
                <TableCell sx={{ width: '15%', whiteSpace: 'nowrap' }}>Creación</TableCell>
                <TableCell sx={{ width: '22%', whiteSpace: 'nowrap' }}>Usuario</TableCell>
                <TableCell align='right' sx={{ width: 72, whiteSpace: 'nowrap' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow key={doc.url || doc.name || index}>
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
          autoHideDuration={6000}
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
      </CardContent>
    </Card>
  )
}

export default ClientDocuments
