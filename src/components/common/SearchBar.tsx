'use client'

import React, { useEffect, useState } from 'react'

import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  extraActions?: React.ReactNode
  delay?: number // <-- tiempo para debounce
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onClear,
  extraActions,
  delay = 300
}) => {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue)
      }
    }, delay)

    return () => clearTimeout(handler)
  }, [internalValue, delay])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        fullWidth
        variant='outlined'
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon color='action' />
            </InputAdornment>
          ),
          endAdornment: internalValue && onClear && (
            <InputAdornment position='end'>
              <IconButton onClick={onClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {extraActions}
    </Box>
  )
}

export default SearchBar
