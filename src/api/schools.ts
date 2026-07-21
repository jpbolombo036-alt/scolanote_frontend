import api from './axios'
import type { School, SchoolRequest, SchoolResponse, PaginatedResponse } from '@/types'

export async function createSchool(data: SchoolRequest): Promise<SchoolResponse> {
  const response = await api.post('/api/ecoles', data)
  return response.data
}

export async function getSchool(id: number): Promise<SchoolResponse> {
  const response = await api.get(`/api/ecoles/${id}`)
  return response.data
}

export async function getAllSchools(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<SchoolResponse>> {
  const response = await api.get('/api/ecoles', { params })
  return response.data
}

export async function getAllSchoolsUnpaginated(): Promise<SchoolResponse[]> {
  const response = await api.get('/api/ecoles/all')
  return response.data
}

export async function updateSchool(id: number, data: SchoolRequest): Promise<SchoolResponse> {
  const response = await api.put(`/api/ecoles/${id}`, data)
  return response.data
}

export async function deleteSchool(id: number): Promise<void> {
  await api.delete(`/api/ecoles/${id}`)
}
