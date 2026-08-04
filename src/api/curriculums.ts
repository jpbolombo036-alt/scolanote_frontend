import api from './axios'
import type { Curriculum, CurriculumRequest, CurriculumResponse, PaginatedResponse } from '@/types'

export async function createCurriculum(data: CurriculumRequest): Promise<CurriculumResponse> {
  const response = await api.post('/api/programmes', data)
  return response.data
}

export async function getCurriculum(id: number): Promise<CurriculumResponse> {
  const response = await api.get(`/api/programmes/${id}`)
  return response.data
}

export async function getAllCurricula(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<CurriculumResponse>> {
  const response = await api.get('/api/programmes', { params })
  return response.data
}

export async function getAllCurriculaUnpaginated(): Promise<CurriculumResponse[]> {
  const response = await api.get('/api/programmes/all')
  return response.data
}

export async function getCurriculaByLevel(niveauId: number): Promise<CurriculumResponse[]> {
  const response = await api.get(`/api/programmes/niveau/${niveauId}`)
  return response.data
}

export async function getCurriculaBySection(sectionId: number): Promise<CurriculumResponse[]> {
  const response = await api.get(`/api/programmes/section/${sectionId}`)
  return response.data
}

export async function getCurriculaByOption(optionId: number): Promise<CurriculumResponse[]> {
  const response = await api.get(`/api/programmes/option/${optionId}`)
  return response.data
}

export async function updateCurriculum(id: number, data: CurriculumRequest): Promise<CurriculumResponse> {
  const response = await api.put(`/api/programmes/${id}`, data)
  return response.data
}

export async function deleteCurriculum(id: number): Promise<void> {
  await api.delete(`/api/programmes/${id}`)
}