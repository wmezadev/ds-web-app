'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Box,
  Divider,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Button,
  Paper
} from '@mui/material'
import {
  Email,
  Phone,
  Business,
  Cake,
  Home,
  Place,
  Person,
  Lock,
  Security,
  Devices,
  Edit,
  Description,
  ContactPage,
  AccountBalance
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

// --- Mock Data ---
const mockClientData = {
  id: 879861,
  first_name: 'Willian Ernesto',
  last_name: 'Meza Moncada',
  person_type: 'N',
  document_number: 'V-27902796',
  join_date: '2025-08-21T10:00:00Z',
  email_1: 'wmeza@willianmeza.com',
  email_2: 'wmeza@seguiconsult.com',
  mobile_1: '(0414)-351-3899',
  phone: '(0414)-565-23-22',
  city: 'Barquisimeto',
  zone: 'Oeste',
  billing_address: 'CALLE 45 ENTRE CARRERAS 14 Y 15 CASA N° 14-44 SECTOR OESTE',
  birth_date: '1960-10-30',
  birth_place: 'BARQUISIMETO',
  policies: 12,
  premiums: '200,074',
  status: 'Activo',
  avatarUrl: '/images/avatars/1.png'
}

const mockRecentDevices = [
  { id: 1, name: 'Google Chrome', browser: 'Chrome on macOS', location: 'USA, New York', ip: '192.168.1.1' },
  { id: 2, name: 'Firefox', browser: 'Firefox on Windows', location: 'Venezuela, Lara', ip: '10.0.0.5' }
]

const DetailItem = ({ icon: Icon, label, value }) => {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1.5 }}>
      <Icon sx={{ color: 'text.secondary' }} fontSize='small' />
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <Box component='span' sx={{ color: 'text.secondary' }}>
          {label}:
        </Box>
        <Box component='span' fontWeight='bold' sx={{ ml: 1 }}>
          {value}
        </Box>
      </Typography>
    </Box>
  )
}

const ClientProfileCard = ({ client }) => (
  <Card elevation={0} sx={{ borderRadius: 2, p: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{ width: 90, height: 90, mb: 1, border: '2px solid', borderColor: 'divider' }}
          alt={`${client.first_name} ${client.last_name}`}
          src={client.avatarUrl}
        />
        <Typography variant='h6' fontWeight='bold' sx={{ textAlign: 'center' }}>
          {`${client.first_name} ${client.last_name}`}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          {client.person_type === 'N' ? 'Natural' : 'Jurídica'}
        </Typography>
        <Typography
          variant='caption'
          sx={{ bgcolor: 'primary.lightOpacity', color: 'primary.main', p: 0.5, borderRadius: 1 }}
        >
          Cliente
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 4, mt: 3, mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h6' fontWeight='bold' color='primary.main'>
            {client.policies}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Pólizas
          </Typography>
        </Box>
        <Divider orientation='vertical' flexItem />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h6' fontWeight='bold' color='primary.main'>
            ${client.premiums}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Primas
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const ClientDetailsCard = ({ client }) => (
  <Card elevation={0} sx={{ borderRadius: 2 }}>
    <CardContent>
      <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
        Details
      </Typography>
      <DetailItem icon={Person} label='Estado' value={client.status} />
      <DetailItem icon={Cake} label='Fecha Ingreso' value={new Date(client.join_date).toLocaleDateString('es-ES')} />
      <Divider sx={{ my: 1 }} />
      <DetailItem icon={Phone} label='Teléfonos' value={`${client.mobile_1} | ${client.phone}`} />
      <DetailItem icon={Email} label='Correos' value={`${client.email_1} | ${client.email_2}`} />
      <Divider sx={{ my: 1 }} />
      <DetailItem icon={Business} label='Ciudad/Zona' value={`${client.city} / ${client.zone}`} />
      <DetailItem icon={Home} label='Dirección' value={client.billing_address} />
      <Divider sx={{ my: 1 }} />
      <DetailItem
        icon={Cake}
        label='Fecha Nac./Fund.'
        value={new Date(client.birth_date).toLocaleDateString('es-ES')}
      />
      <DetailItem icon={Place} label='Lugar de Nac./Fund.' value={client.birth_place} />
    </CardContent>
  </Card>
)

// --- Panel de la derecha ---

const DocumentList = () => (
  <Card elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
    <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
      Aquí irán los Documentos
    </Typography>
  </Card>
)

const TwoStepVerificationSection = () => (
  <Card elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
    <Typography variant='h6' fontWeight='bold' sx={{ mb: 2 }}>
      Two-step verification
    </Typography>
    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
      Keep your account secure with authentication step.
    </Typography>
    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
      <Typography variant='subtitle2' color='text.secondary'>
        SMS
      </Typography>
      <Typography variant='body1' fontWeight='bold'>
        +{mockClientData.phone.replace(' ', '')}
      </Typography>
    </Box>
  </Card>
)

const ClientMainContent = () => {
  const [value, setValue] = React.useState(0)
  const theme = useTheme()

  const tabs = [
    { label: 'Datos Personales', icon: <Person /> },
    { label: 'Documentos', icon: <Description /> },
    { label: 'Contactos', icon: <ContactPage /> },
    { label: 'Info. Bancaria', icon: <AccountBalance /> },
    { label: 'Registro', icon: <i className='ri-history-line' /> }
  ]

  const handleChange = newValue => {
    setValue(newValue)
  }

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = React.useState({ left: false, right: false })

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const left = scrollLeft > 0
      const right = scrollLeft < scrollWidth - clientWidth - 1
      setShowArrows({ left, right })
    }
  }

  React.useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      checkArrows()
      const resizeObserver = new ResizeObserver(checkArrows)
      resizeObserver.observe(scrollElement)
      scrollElement.addEventListener('scroll', checkArrows)

      return () => {
        resizeObserver.unobserve(scrollElement)
        scrollElement.removeEventListener('scroll', checkArrows)
      }
    }
  }, [tabs])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Contenedor de botones de navegación con flechas */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          mb: 4
        }}
      >
        {showArrows.left && (
          <IconButton onClick={() => handleScroll('left')} size='small' sx={{ mr: 1 }}>
            <i className='ri-arrow-left-s-line' />
          </IconButton>
        )}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            overflowX: 'auto',
            flexGrow: 1,
            '::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {tabs.map((tab, index) => (
            <Button
              key={index}
              variant={index === value ? 'contained' : 'text'}
              onClick={() => handleChange(index)}
              sx={{
                textTransform: 'none',
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                mr: 2,
                py: 1.5
              }}
              startIcon={tab.icon}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
        {showArrows.right && (
          <IconButton onClick={() => handleScroll('right')} size='small' sx={{ ml: 1 }}>
            <i className='ri-arrow-right-s-line' />
          </IconButton>
        )}
      </Box>

      {/* Contenedor de contenido */}
      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          {value === 0 && <Box>{/* Contenido Documentos */}</Box>}
          {value === 1 && (
            <Box>
              <Typography>Aquí irá la lista de Contactos</Typography>
            </Box>
          )}
          {value === 2 && (
            <Box>
              <Typography>Aquí irá la Información Bancaria</Typography>
            </Box>
          )}
          {value === 3 && (
            <Box>
              <Typography>Aquí irá la sección de Dispositivos</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}
// --- Página Principal ---

const ClientDetailPage = () => {
  const [currentTab, setCurrentTab] = React.useState('resumen')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant='h5' fontWeight='bold'>
          Cliente #{mockClientData.id}
        </Typography>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label='Resumen' value='resumen' />
          <Tab label='Seguimientos' value='seguimientos' />
          <Tab label='Pólizas' value='polizas' />
          <Tab label='Recibos' value='recibos' />
          <Tab label='Certificados' value='certificados' />
          <Tab label='Siniestros' value='siniestros' />
        </Tabs>
      </Box>

      <Box sx={{ mt: 4 }}>
        {currentTab === 'resumen' && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Grid container direction='column' spacing={4}>
                <Grid item xs={12}>
                  <ClientProfileCard client={mockClientData} />
                </Grid>
                <Grid item xs={12}>
                  <ClientDetailsCard client={mockClientData} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={8}>
              <ClientMainContent />
            </Grid>
          </Grid>
        )}
        {currentTab === 'seguimientos' && <Typography>Contenido de Seguimientos</Typography>}
        {currentTab === 'polizas' && <Typography>Contenido de Pólizas</Typography>}
        {currentTab === 'recibos' && <Typography>Contenido de Recibos</Typography>}
        {currentTab === 'certificados' && <Typography>Contenido de Certificados</Typography>}
        {currentTab === 'siniestros' && <Typography>Contenido de Siniestros</Typography>}
      </Box>
    </Box>
  )
}

export default ClientDetailPage
