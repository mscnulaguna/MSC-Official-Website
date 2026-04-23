export function getApiBaseUrl(): string {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  if (!configuredBase) {
    return '/api/v1'
  }

  if (configuredBase.endsWith('/api/v1')) {
    return configuredBase
  }

  if (configuredBase.endsWith('/api')) {
    return `${configuredBase}/v1`
  }

  return `${configuredBase}/api/v1`
}