// Client-side safe constants
export const API_PROXY_PATH = '/api/proxy'

export const API_ROUTES = {
  HEALTH: 'health',
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REGISTER: 'auth/register',
    REFRESH: 'auth/refresh',
    ME: 'auth/me',
    CHANGE_PASSWORD: 'auth/change-password',
    CSRF_TOKEN: 'auth/csrf_token',
    CSRF_VALIDATE: 'auth/csrf_validate',
    CSRF_REVOKE: 'auth/csrf_revoke'
  },
  CLIENTS: {
    LIST: 'clients',
    GET: (id: string | number) => `clients/${id}`,
    SEARCH: 'clients/search',
    UPDATE: (id: string | number) => `clients/${id}`,
    DELETE: (id: string | number) => `clients/${id}`,
    POST: 'clients'
  },
  QUOTATIONS: {
    LIST: '/quotations',
    GET: '/quotations/:id'
  }
}

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  CLIENTS: {
    INDEX: '/clients',
    CREATE: '/clients/create',
    DETAIL: (id: string | number) => `/clients/${id}`
  },
  QUOTATIONS: {
    INDEX: '/quotations',
    CREATE: '/quotations/create'
  },
  POLICIES: {
    INDEX: '/policies',
    CREATE: '/policies/create'
  },
  CERTIFICATES: {
    INDEX: '/certificates',
    CREATE: '/certificates/create'
  },
  RECEIPTS: {
    INDEX: '/receipts'
  },
  SINISTERS: {
    INDEX: '/sinisters'
  },
  REPORTS: {
    INDEX: '/reports'
  },
  ABOUT: '/about'
}
