import api from './axios'
import type { Option, OptionRequest, OptionResponse, PaginatedResponse } from '@/types'

export async function createOption(data: OptionRequest): Promise<OptionResponse> {
  const response = await api.post('/api/options', data)
  return response.data
}

export async function getOption(id: number): Promise<OptionResponse> {
  const response = await api.get(`/api/options/${id}`)
  return response.data
}

export async function getAllOptions(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<OptionResponse>> {
  const response = await api.get('/api/options', { params })
  return response.data
}

export async function getAllOptionsUnpaginated(): Promise<OptionResponse[]> {
  const response = await api.get('/api/options/all')
  return response.data
}

export async function getOptionsBySection(sectionId: number): Promise<OptionResponse[]> {
  const response = await api.get(`/api/options/section/${sectionId}`)
  return response.data
}

export async function updateOption(id: number, data: OptionRequest): Promise<OptionResponse> {
  const response = await api.put(`/api/options/${id}`, data)
  return response.data
}

export async function deleteOption(id: number): Promise<void> {
  await api.delete(`/api/options/${id}`)
}