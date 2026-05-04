import { API_BASE_URL } from '@/lib/api-config'

export async function request(path: string, options: RequestInit = {}) {
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
  
  return data
}
