// React Imports
import { useState } from 'react'

// MUI Imports
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Portal from '@mui/material/Portal'

// Type Imports
interface ClientNavButtonsProps {
  clientId: string
}

const ClientNavButtons = ({ clientId }: ClientNavButtonsProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)

  const buttons = [
    { key: 'polizas', icon: <i className='ri-shield-check-line' />, label: 'Pólizas' },
    { key: 'recibos', icon: <i className='ri-receipt-line' />, label: 'Recibos' },
    { key: 'certificados', icon: <i className='ri-shield-star-line' />, label: 'Certificados' },
    { key: 'siniestros', icon: <i className='ri-fire-line' />, label: 'Siniestros' }
  ]

  const handleButtonClick = (buttonKey: string) => {
    // Here you can add navigation logic or emit events
    console.log(`Navigating to ${buttonKey} for client ${clientId}`)

    if (isMobile) {
      setOpen(false) // Close the speed dial on mobile after selection
    }
  }

  return (
    <>
      {/* Desktop version - full buttons in navbar */}
      {!isMobile && (
        <>
          <Divider orientation='vertical' flexItem sx={{ mx: 2, height: 28, alignSelf: 'center' }} />
          <ButtonGroup variant='outlined'>
            {buttons.map(button => (
              <Button
                key={button.key}
                variant={'outlined'}
                href={`/clients/${clientId}`}
                onClick={() => handleButtonClick(button.key)}
                startIcon={button.icon}
                sx={{
                  px: 2,
                  py: 0.5,
                  '& .MuiButton-startIcon': {
                    margin: '0 4px 0 0'
                  }
                }}
              >
                {button.label}
              </Button>
            ))}
          </ButtonGroup>
        </>
      )}

      {/* Mobile FAB with SpeedDial */}
      {isMobile && (
        <Portal>
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              zIndex: 9999 // Higher z-index to stay above sticky navbar
            }}
          >
            <SpeedDial
              ariaLabel='Client navigation'
              sx={{
                '& .MuiSpeedDial-fab': {
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }
              }}
              icon={<i className='ri-menu-line' />}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
            >
              {buttons.map(button => (
                <SpeedDialAction
                  key={button.key}
                  icon={button.icon}
                  tooltipTitle={button.label}
                  onClick={() => handleButtonClick(button.key)}
                  sx={{
                    '& .MuiSpeedDialAction-fab': {
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }
                  }}
                />
              ))}
            </SpeedDial>
          </Box>
        </Portal>
      )}
    </>
  )
}

export default ClientNavButtons
