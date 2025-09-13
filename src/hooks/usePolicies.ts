import { useState, useEffect, useCallback } from 'react'
import { usePaginatedResource } from './usePaginatedResource'
import type { Policy } from '@/types/policy'

interface UsePoliciesOptions {
  initialPerPage?: number
  enabled?: boolean
  endpoint?: string
  dataKey?: string
}

export function usePolicies({
  initialPerPage = 10,
  enabled = true,
  endpoint = 'policies',
  dataKey = 'policies'
}: UsePoliciesOptions = {}) {
  return usePaginatedResource<Policy>({
    endpoint,
    dataKey,
    initialPerPage,
    enabled
  })
}
