import api from './axios'
import type { Subject, SubjectRequest, SubjectResponse, PaginatedResponse } from '@/types'

export async function createSubject(data: SubjectRequest): Promise<SubjectResponse> {
  const response = await api.post('/api/matieres', data)
  return response.data
}

export async function getSubject(id: number): Promise<SubjectResponse> {
  const response = await api.get(`/api/matieres/${id}`)
  return response.data
}

export async function getAllSubjects(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<SubjectResponse>> {
  const response = await api.get('/api/matieres', { params })
  return response.data
}

export async function getAllSubjectsUnpaginated(): Promise<SubjectResponse[]> {
  const response = await api.get('/api/matieres/all')
  return response.data
}

export async function updateSubject(id: number, data: SubjectRequest): Promise<SubjectResponse> {
  const response = await api.put(`/api/matieres/${id}`, data)
  return response.data
}

export async function deleteSubject(id: number): Promise<void> {
  await api.delete(`/api/matieres/${id}`)
}
