import api from './axios'
import type { Trimester, TrimesterRequest, TrimesterResponse, PaginatedResponse } from '@/types'

export async function createTrimester(data: TrimesterRequest): Promise<TrimesterResponse> {
  const response = await api.post('/api/trimestres', data)
  return response.data
}

export async function getTrimester(id: number): Promise<TrimesterResponse> {
  const response = await api.get(`/api/trimestres/${id}`)
  return response.data
}

export async function getAllTrimesters(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<TrimesterResponse>> {
  const response = await api.get('/api/trimestres', { params })
  return response.data
}

export async function getAllTrimestersUnpaginated(): Promise<TrimesterResponse[]> {
  const response = await api.get('/api/trimestres/all')
  return response.data
}

export async function getTrimestersByAcademicYear(academicYearId: number): Promise<TrimesterResponse[]> {
  const response = await api.get(`/api/trimestres/annee-academique/${academicYearId}`)
  return response.data
}

export async function updateTrimester(id: number, data: TrimesterRequest): Promise<TrimesterResponse> {
  const response = await api.put(`/api/trimestres/${id}`, data)
  return response.data
}

export async function deleteTrimester(id: number): Promise<void> {
  await api.delete(`/api/trimestres/${id}`)
}
