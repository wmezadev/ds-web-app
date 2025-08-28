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
import { useApi } from '@/hooks/useApi'

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

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client, refreshClient }) => {
  const { data: session } = useSession()
  const { profileData } = useProfileData()
  const { fetchApi } = useApi()
  const currentUserName =
    (session?.user as any)?.name || (profileData as any)?.name || (profileData as any)?.username || '—'
  const currentUserAvatar =
    (session?.user as any)?.image || (profileData as any)?.avatar || (profileData as any)?.image || null
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const normalizeDate = (val: any): string => {
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

  const mapApiToDocuments = (data: any): Document[] => {
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

    // If backend wraps in { files: [...] }
    let arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.files) ? data.files : []

    // Additional common wrappers
    if (!arr.length && Array.isArray(data?.data?.files)) arr = data.data.files
    if (!arr.length && Array.isArray(data?.data?.items)) arr = data.data.items
    if (!arr.length && Array.isArray(data?.data)) arr = data.data
    if (!arr.length && Array.isArray(data?.items)) arr = data.items
    if (!arr.length && Array.isArray(data?.results)) arr = data.results
    if (!arr.length && Array.isArray(data?.keys)) arr = data.keys
    if (!arr.length && Array.isArray(data?.data?.keys)) arr = data.data.keys
    if (!arr.length && Array.isArray(data?.files?.keys)) arr = data.files.keys
    if (!arr.length && Array.isArray(data?.Contents)) arr = data.Contents
    if (!arr.length && Array.isArray(data?.contents)) arr = data.contents
    if (!arr.length && Array.isArray(data?.files?.Contents)) arr = data.files.Contents

    // Support array of strings (keys/urls)
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

    // If single object
    if (typeof data === 'object') return [mapOne(data)]

    return []
  }

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true)
      const rawPrefix = `clients/${client?.id}`
      const prefNoSlash = rawPrefix.replace(/\/+$/, '')
      const prefWithSlash = `${prefNoSlash}/`

      const tryFetch = async (basePath: string) => {
        try {
          const data1 = await fetchApi<unknown>(`${basePath}?prefix=${encodeURIComponent(prefNoSlash)}`)
          console.log(`API documentos ${basePath} (no slash) ->`, data1)
          let mapped = mapApiToDocuments(data1)
          if (!mapped.length) {
            const data2 = await fetchApi<unknown>(`${basePath}?prefix=${encodeURIComponent(prefWithSlash)}`)
            console.log(`API documentos ${basePath} (with slash) ->`, data2)
            mapped = mapApiToDocuments(data2)
          }
          return mapped
        } catch (err) {
          throw err
        }
      }

      try {
        // Primary: use path relative to API_BASE_URL (API_BASE_URL already ends with /api/v1)
        let mapped = await tryFetch('aws/s3/files')
        if (!mapped.length) {
          // If empty, nothing else to try
          setDocuments(mapped)
        } else {
          setDocuments(mapped)
        }
      } catch (error: any) {
        // If 404 on path without trailing slash, try with trailing slash
        if (error instanceof Error && error.message.includes('status: 404')) {
          try {
            // Fallback to legacy full path just in case server expects it
            const mapped2 = await tryFetch('/api/v1/aws/s3/files/')
            setDocuments(mapped2)
          } catch (e2) {
            console.error('Error al cargar documentos (retry):', e2)
          }
        } else {
          console.error('Error al cargar documentos:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    if (client?.id) loadDocuments()
  }, [client?.id, fetchApi])

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
