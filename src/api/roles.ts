import api from './axios'
import type { Role, RoleRequest, RoleResponse } from '@/types'

export async function getAllRoles(): Promise<RoleResponse[]> {
  const response = await api.get('/api/roles')
  return response.data
}

export async function getRole(id: number): Promise<RoleResponse> {
  const response = await api.get(`/api/roles/${id}`)
  return response.data
}

export async function createRole(data: RoleRequest): Promise<RoleResponse> {
  const response = await api.post('/api/roles', data)
  return response.data
}

export async function updateRole(id: number, data: RoleRequest): Promise<RoleResponse> {
  const response = await api.put(`/api/roles/${id}`, data)
  return response.data
}

export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/api/roles/${id}`)
}
