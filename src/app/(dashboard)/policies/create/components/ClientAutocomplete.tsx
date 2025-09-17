'use client'

import React from 'react'
import { Autocomplete, TextField, CircularProgress } from '@mui/material'
import { useClientSearch } from '../hooks/useClientSearch'
import type { Client } from '@/types/client'

interface ClientAutocompleteProps {
  label: string
  value: number | null
  onChange: (id: number | null) => void
  error?: boolean
  helperText?: string
}

export function ClientAutocomplete({ label, value, onChange, error, helperText }: ClientAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const { results: options, loading } = useClientSearch(inputValue, open || inputValue.length > 0)

  const selectedOption = React.useMemo(() => {
    if (!value || options.length === 0) return null
    return options.find(option => option.id === value) || null
  }, [value, options])

  return (
    <Autocomplete<Client>
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      value={selectedOption}
      getOptionLabel={option => `${option.first_name} ${option.last_name}`.trim()}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue)
      }}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.id : null)
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
