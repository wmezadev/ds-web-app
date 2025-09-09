'use client'

import { useState, useCallback } from 'react'

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarState {
  open: boolean
  message: string
  severity: SnackbarSeverity
}

export interface UseSnackbarReturn {
  snackbar: SnackbarState
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void
  hideSnackbar: () => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
}

/**
 * Custom hook for managing snackbar state and actions
 *
 * @param defaultSeverity - Default severity level for showSnackbar calls
 * @param autoHideDuration - Optional auto-hide duration override
 * @returns Object with snackbar state and control functions
 *
 * @example
 * const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar()
 *
 * // Show different types of messages
 * showSuccess('Operation completed successfully!')
 * showError('Something went wrong')
 * showWarning('Please check your input')
 * showInfo('Here's some information')
 *
 * // Manual control
 * showSnackbar('Custom message', 'info')
 * hideSnackbar()
 */
export const useSnackbar = (defaultSeverity: SnackbarSeverity = 'info'): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: defaultSeverity
  })

  const showSnackbar = useCallback(
    (message: string, severity: SnackbarSeverity = defaultSeverity) => {
      setSnackbar({
        open: true,
        message,
        severity
      })
    },
    [defaultSeverity]
  )

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const showSuccess = useCallback(
    (message: string) => {
      showSnackbar(message, 'success')
    },
    [showSnackbar]
  )

  const showError = useCallback(
    (message: string) => {
      showSnackbar(message, 'error')
    },
    [showSnackbar]
  )

  const showWarning = useCallback(
    (message: string) => {
      showSnackbar(message, 'warning')
    },
    [showSnackbar]
  )

  const showInfo = useCallback(
    (message: string) => {
      showSnackbar(message, 'info')
    },
    [showSnackbar]
  )

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default useSnackbar
