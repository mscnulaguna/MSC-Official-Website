export function getApiBaseUrl(): string {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  if (!configuredBase) {
    return '/api/v1'
  }

  if (configuredBase.endsWith('/api/v1')) {
    return configuredBase
  }

  const versionedBase = configuredBase.match(/^(.*)\/v(\d+)$/)

  if (versionedBase) {
    return `${versionedBase[1]}/api/v${versionedBase[2]}`
  }

  if (configuredBase.endsWith('/api')) {
    return `${configuredBase}/v1`
  }

  return `${configuredBase}/api/v1`
}