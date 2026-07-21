import api from './axios'
import type { Assessment, AssessmentRequest, AssessmentResponse, PaginatedResponse } from '@/types'

export async function createAssessment(data: AssessmentRequest): Promise<AssessmentResponse> {
  const response = await api.post('/api/evaluations', data)
  return response.data
}

export async function getAssessment(id: number): Promise<AssessmentResponse> {
  const response = await api.get(`/api/evaluations/${id}`)
  return response.data
}

export async function getAllAssessments(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<AssessmentResponse>> {
  const response = await api.get('/api/evaluations', { params })
  return response.data
}

export async function getAssessmentsByAssignment(assignmentId: number): Promise<AssessmentResponse[]> {
  const response = await api.get(`/api/evaluations/assignment/${assignmentId}`)
  return response.data
}

export async function getAssessmentsByPeriod(periodId: number): Promise<AssessmentResponse[]> {
  const response = await api.get(`/api/evaluations/period/${periodId}`)
  return response.data
}

export async function updateAssessment(id: number, data: AssessmentRequest): Promise<AssessmentResponse> {
  const response = await api.put(`/api/evaluations/${id}`, data)
  return response.data
}

export async function deleteAssessment(id: number): Promise<void> {
  await api.delete(`/api/evaluations/${id}`)
}
