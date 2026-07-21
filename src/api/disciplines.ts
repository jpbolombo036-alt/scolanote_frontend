import api from './axios'
import type { Discipline, DisciplineRequest, DisciplineResponse, PaginatedResponse } from '@/types'

export async function createDiscipline(data: DisciplineRequest): Promise<DisciplineResponse> {
  const response = await api.post('/api/disciplines', data)
  return response.data
}

export async function getDiscipline(id: number): Promise<DisciplineResponse> {
  const response = await api.get(`/api/disciplines/${id}`)
  return response.data
}

export async function getAllDisciplines(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<DisciplineResponse>> {
  const response = await api.get('/api/disciplines', { params })
  return response.data
}

export async function getDisciplinesByStudent(studentId: number): Promise<DisciplineResponse[]> {
  const response = await api.get(`/api/disciplines/student/${studentId}`)
  return response.data
}

export async function getDisciplinesByPeriod(periodId: number): Promise<DisciplineResponse[]> {
  const response = await api.get(`/api/disciplines/period/${periodId}`)
  return response.data
}

export async function updateDiscipline(id: number, data: DisciplineRequest): Promise<DisciplineResponse> {
  const response = await api.put(`/api/disciplines/${id}`, data)
  return response.data
}

export async function deleteDiscipline(id: number): Promise<void> {
  await api.delete(`/api/disciplines/${id}`)
}
