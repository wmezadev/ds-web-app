import type { Metadata } from 'next'

import ClientsPage from '@/views/ClientsPage'
import { CLIENTS_PAGE } from '@/constants/texts'

export const metadata: Metadata = {
  ...CLIENTS_PAGE.metadata
}

export default function Page() {
  return <ClientsPage />
}
