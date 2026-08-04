import api from './axios'

export async function getDebugInfo(): Promise<any> {
  const response = await api.get('/debug/whoami')
  return response.data
}