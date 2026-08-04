import api from './axios'
import type { CurriculumSubject, CurriculumSubjectRequest, CurriculumSubjectResponse, PaginatedResponse } from '@/types'

export async function createCurriculumSubject(data: CurriculumSubjectRequest): Promise<CurriculumSubjectResponse> {
  const response = await api.post('/api/matieres-programme', data)
  return response.data
}

export async function getCurriculumSubject(id: number): Promise<CurriculumSubjectResponse> {
  const response = await api.get(`/api/matieres-programme/${id}`)
  return response.data
}

export async function getAllCurriculumSubjects(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<CurriculumSubjectResponse>> {
  const response = await api.get('/api/matieres-programme', { params })
  return response.data
}

export async function getAllCurriculumSubjectsUnpaginated(): Promise<CurriculumSubjectResponse[]> {
  const response = await api.get('/api/matieres-programme/all')
  return response.data
}

export async function getByCurriculum(programmeId: number): Promise<CurriculumSubjectResponse[]> {
  const response = await api.get(`/api/matieres-programme/programme/${programmeId}`)
  return response.data
}

export async function updateCurriculumSubject(id: number, data: CurriculumSubjectRequest): Promise<CurriculumSubjectResponse> {
  const response = await api.put(`/api/matieres-programme/${id}`, data)
  return response.data
}

export async function deleteCurriculumSubject(id: number): Promise<void> {
  await api.delete(`/api/matieres-programme/${id}`)
}