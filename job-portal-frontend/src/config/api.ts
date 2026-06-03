const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`
}
