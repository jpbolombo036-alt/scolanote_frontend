import api from './axios'
import type { LoginRequest, LoginResponse } from '@/types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/auth/token', data)
  return response.data
}
