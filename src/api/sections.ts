import api from './axios'
import type { Section, SectionRequest, SectionResponse, PaginatedResponse } from '@/types'

export async function createSection(data: SectionRequest): Promise<SectionResponse> {
  const response = await api.post('/api/sections', data)
  return response.data
}

export async function getSection(id: number): Promise<SectionResponse> {
  const response = await api.get(`/api/sections/${id}`)
  return response.data
}

export async function getAllSections(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<SectionResponse>> {
  const response = await api.get('/api/sections', { params })
  return response.data
}

export async function getAllSectionsUnpaginated(): Promise<SectionResponse[]> {
  const response = await api.get('/api/sections/all')
  return response.data
}

export async function updateSection(id: number, data: SectionRequest): Promise<SectionResponse> {
  const response = await api.put(`/api/sections/${id}`, data)
  return response.data
}

export async function deleteSection(id: number): Promise<void> {
  await api.delete(`/api/sections/${id}`)
}