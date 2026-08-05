import api from './axios'
import type { LoginRequest, LoginResponse, RegisterAgentRequest, RegisterAgentResponse, PasswordResetRequest, PasswordResetConfirm, ProfileUpdateRequest, ChangePasswordRequest } from '@/types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/auth/token', data)
  return response.data
}

export async function registerAgent(data: RegisterAgentRequest): Promise<RegisterAgentResponse> {
  const response = await api.post('/auth/register-agent', data)
  return response.data
}

export async function forgotPassword(email: string): Promise<string> {
  const response = await api.post('/auth/mot-de-passe-oublie', { email })
  return response.data
}

export async function resetPassword(token: string, newPassword: string): Promise<string> {
  const response = await api.post('/auth/reinitialiser-mot-de-passe', { token, newPassword })
  return response.data
}

export async function updateProfile(data: ProfileUpdateRequest) {
  const response = await api.put('/auth/me', data)
  return response.data
}

export async function changePassword(data: ChangePasswordRequest) {
  const response = await api.post('/auth/change-password', data)
  return response.data
}

export async function activateUser(username: string): Promise<string> {
  const response = await api.post('/auth/activer-utilisateur', null, { params: { username } })
  return response.data
}
