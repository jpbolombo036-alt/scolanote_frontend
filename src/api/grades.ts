import api from './axios'
import type { Grade, GradeRequest, GradeResponse, PaginatedResponse } from '@/types'

export async function createGrade(data: GradeRequest): Promise<GradeResponse> {
  const response = await api.post('/api/notes', data)
  return response.data
}

export async function getGrade(id: number): Promise<GradeResponse> {
  const response = await api.get(`/api/notes/${id}`)
  return response.data
}

export async function getAllGrades(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<GradeResponse>> {
  const response = await api.get('/api/notes', { params })
  return response.data
}

export async function getGradesByAssessment(assessmentId: number): Promise<GradeResponse[]> {
  const response = await api.get(`/api/notes/assessment/${assessmentId}`)
  return response.data
}

export async function getGradesByStudent(studentId: number): Promise<GradeResponse[]> {
  const response = await api.get(`/api/notes/student/${studentId}`)
  return response.data
}

export async function updateGrade(id: number, data: GradeRequest): Promise<GradeResponse> {
  const response = await api.put(`/api/notes/${id}`, data)
  return response.data
}

export async function deleteGrade(id: number): Promise<void> {
  await api.delete(`/api/notes/${id}`)
}
