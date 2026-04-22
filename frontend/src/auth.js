const STORAGE_KEYS = {
  accessToken: 'agri_access_token',
  refreshToken: 'agri_refresh_token',
  role: 'agri_user_role',
  email: 'agri_user_email',
  name: 'agri_user_name',
  lastEmail: 'agri_last_email',
}

export function getStoredAuth() {
  return {
    accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
    role: localStorage.getItem(STORAGE_KEYS.role),
    email: localStorage.getItem(STORAGE_KEYS.email),
    name: localStorage.getItem(STORAGE_KEYS.name),
  }
}

export function persistAuthSession({ access, refresh, user }) {
  localStorage.setItem(STORAGE_KEYS.accessToken, access)
  localStorage.setItem(STORAGE_KEYS.refreshToken, refresh)
  localStorage.setItem(STORAGE_KEYS.role, user.role)
  localStorage.setItem(STORAGE_KEYS.email, user.email)
  localStorage.setItem(STORAGE_KEYS.name, user.full_name || user.email.split('@')[0])
  localStorage.setItem(STORAGE_KEYS.lastEmail, user.email)
}

export function updateStoredAccessToken(accessToken) {
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.role)
  localStorage.removeItem(STORAGE_KEYS.email)
  localStorage.removeItem(STORAGE_KEYS.name)
}

export function getLastUsedEmail() {
  return localStorage.getItem(STORAGE_KEYS.lastEmail) || ''
}

export function setLastUsedEmail(email) {
  localStorage.setItem(STORAGE_KEYS.lastEmail, email)
}
