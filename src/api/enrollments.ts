import api from './axios'
import type { Enrollment, EnrollmentRequest, EnrollmentResponse, PaginatedResponse } from '@/types'

export async function createEnrollment(data: EnrollmentRequest): Promise<EnrollmentResponse> {
  const response = await api.post('/api/inscriptions', data)
  return response.data
}

export async function getEnrollment(id: number): Promise<EnrollmentResponse> {
  const response = await api.get(`/api/inscriptions/${id}`)
  return response.data
}

export async function getAllEnrollments(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<EnrollmentResponse>> {
  const response = await api.get('/api/inscriptions', { params })
  return response.data
}

export async function getAllEnrollmentsUnpaginated(): Promise<EnrollmentResponse[]> {
  const response = await api.get('/api/inscriptions/all')
  return response.data
}

export async function getEnrollmentsByStudent(studentId: number): Promise<EnrollmentResponse[]> {
  const response = await api.get(`/api/inscriptions/eleve/${studentId}`)
  return response.data
}

export async function getEnrollmentsByClassroom(classroomId: number): Promise<EnrollmentResponse[]> {
  const response = await api.get(`/api/inscriptions/salle/${classroomId}`)
  return response.data
}

export async function updateEnrollment(id: number, data: EnrollmentRequest): Promise<EnrollmentResponse> {
  const response = await api.put(`/api/inscriptions/${id}`, data)
  return response.data
}

export async function deleteEnrollment(id: number): Promise<void> {
  await api.delete(`/api/inscriptions/${id}`)
}
