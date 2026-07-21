import api from './axios'
import type { Period, PeriodRequest, PeriodResponse, PeriodValidationResponse, PaginatedResponse } from '@/types'

export async function createPeriod(data: PeriodRequest): Promise<PeriodResponse> {
  const response = await api.post('/api/periodes', data)
  return response.data
}

export async function getPeriod(id: number): Promise<PeriodResponse> {
  const response = await api.get(`/api/periodes/${id}`)
  return response.data
}

export async function getAllPeriods(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<PeriodResponse>> {
  const response = await api.get('/api/periodes', { params })
  return response.data
}

export async function getAllPeriodsUnpaginated(): Promise<PeriodResponse[]> {
  const response = await api.get('/api/periodes/all')
  return response.data
}

export async function getPeriodsByTrimester(trimesterId: number): Promise<PeriodResponse[]> {
  const response = await api.get(`/api/periodes/trimestre/${trimesterId}`)
  return response.data
}

export async function getVerrouillees(): Promise<PeriodResponse[]> {
  const response = await api.get('/api/periodes/verrouillees')
  return response.data
}

export async function getOuvertes(): Promise<PeriodResponse[]> {
  const response = await api.get('/api/periodes/ouvertes')
  return response.data
}

export async function validatePeriod(id: number): Promise<PeriodValidationResponse> {
  const response = await api.get(`/api/periodes/${id}/valider`)
  return response.data
}

export async function verrouillerPeriod(id: number): Promise<void> {
  await api.post(`/api/periodes/${id}/verrouiller`)
}

export async function deverrouillerPeriod(id: number): Promise<void> {
  await api.post(`/api/periodes/${id}/deverrouiller`)
}

export async function updatePeriod(id: number, data: PeriodRequest): Promise<PeriodResponse> {
  const response = await api.put(`/api/periodes/${id}`, data)
  return response.data
}

export async function deletePeriod(id: number): Promise<void> {
  await api.delete(`/api/periodes/${id}`)
}
