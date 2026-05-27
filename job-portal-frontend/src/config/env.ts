declare global {
  interface Window {
    __ENV__?: Record<string, string>
  }
}

/**
 * Read a configuration value from runtime (`window.__ENV__`, set by Docker/nginx)
 * or from Vite build-time `import.meta.env` (prefixed with VITE_).
 */
export function getEnv(key: string, fallback = ''): string {
  if (typeof window !== 'undefined' && window.__ENV__?.[key]) {
    return window.__ENV__[key]
  }

  const viteEnv = import.meta.env as Record<string, string | boolean | undefined>
  const value = viteEnv[key]
  return typeof value === 'string' ? value : fallback
}
