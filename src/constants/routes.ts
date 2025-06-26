export const API_BASE_URL = process.env?.API_BASE_URL || ''

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
    GET: 'clients/:id'
  }
}
