import api from './axios'
import type { User, UserResponse, PaginatedResponse } from '@/types'

export async function getAllUsers(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<UserResponse>> {
  const response = await api.get('/api/users', { params })
  return response.data
}

export async function getUser(id: number): Promise<UserResponse> {
  const response = await api.get(`/api/users/${id}`)
  return response.data
}

export async function createUser(data: Partial<User>): Promise<UserResponse> {
  const response = await api.post('/api/users', data)
  return response.data
}

export async function updateUser(id: number, data: Partial<User>): Promise<UserResponse> {
  const response = await api.put(`/api/users/${id}`, data)
  return response.data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/api/users/${id}`)
}
