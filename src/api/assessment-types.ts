import api from './axios'
import type { AssessmentType, AssessmentTypeRequest, AssessmentTypeResponse } from '@/types'

export async function createAssessmentType(data: AssessmentTypeRequest): Promise<AssessmentTypeResponse> {
  const response = await api.post('/api/types-evaluations', data)
  return response.data
}

export async function getAssessmentType(id: number): Promise<AssessmentTypeResponse> {
  const response = await api.get(`/api/types-evaluations/${id}`)
  return response.data
}

export async function getAllAssessmentTypes(): Promise<AssessmentTypeResponse[]> {
  const response = await api.get('/api/types-evaluations')
  return response.data
}

export async function updateAssessmentType(id: number, data: AssessmentTypeRequest): Promise<AssessmentTypeResponse> {
  const response = await api.put(`/api/types-evaluations/${id}`, data)
  return response.data
}

export async function deleteAssessmentType(id: number): Promise<void> {
  await api.delete(`/api/types-evaluations/${id}`)
}
