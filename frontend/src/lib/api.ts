import { API_BASE_URL } from '@/lib/api-config'
import { validateData, apiResponseSchema } from '@/lib/validation'

export async function request(path: string, options: RequestInit = {}) {
  // Validate path
  if (!path || typeof path !== 'string') {
    throw new Error('Invalid path parameter')
  }

  const headers = new Headers(options.headers || {})
  
  // Set default Content-Type to JSON if not specified
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  // Parse JSON if possible
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json().catch(() => ({})) : await response.text()

  if (!response.ok) {
    const errorMessage = (typeof data === 'object' && data.message) ? data.message : 'Lỗi hệ thống'
    throw new Error(errorMessage)
  }
  
  // Validate response data
  try {
    return validateData(apiResponseSchema, data)
  } catch {
    return data
  }
}
