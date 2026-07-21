import api from './axios'
import type { AcademicYear, AcademicYearRequest, AcademicYearResponse, PaginatedResponse } from '@/types'

export async function createAcademicYear(data: AcademicYearRequest): Promise<AcademicYearResponse> {
  const response = await api.post('/api/annees-academiques', data)
  return response.data
}

export async function getAcademicYear(id: number): Promise<AcademicYearResponse> {
  const response = await api.get(`/api/annees-academiques/${id}`)
  return response.data
}

export async function getAllAcademicYears(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<AcademicYearResponse>> {
  const response = await api.get('/api/annees-academiques', { params })
  return response.data
}

export async function getAllAcademicYearsUnpaginated(): Promise<AcademicYearResponse[]> {
  const response = await api.get('/api/annees-academiques/all')
  return response.data
}

export async function getAcademicYearsBySchool(schoolId: number): Promise<AcademicYearResponse[]> {
  const response = await api.get(`/api/annees-academiques/ecole/${schoolId}`)
  return response.data
}

export async function updateAcademicYear(id: number, data: AcademicYearRequest): Promise<AcademicYearResponse> {
  const response = await api.put(`/api/annees-academiques/${id}`, data)
  return response.data
}

export async function deleteAcademicYear(id: number): Promise<void> {
  await api.delete(`/api/annees-academiques/${id}`)
}
