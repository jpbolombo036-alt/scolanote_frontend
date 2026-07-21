import api from './axios'
import type { Student, StudentRequest, StudentResponse, PaginatedResponse } from '@/types'

export async function createStudent(data: StudentRequest): Promise<StudentResponse> {
  const response = await api.post('/api/eleves', data)
  return response.data
}

export async function getStudent(id: number): Promise<StudentResponse> {
  const response = await api.get(`/api/eleves/${id}`)
  return response.data
}

export async function getAllStudents(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<StudentResponse>> {
  const response = await api.get('/api/eleves', { params })
  return response.data
}

export async function getAllStudentsUnpaginated(): Promise<StudentResponse[]> {
  const response = await api.get('/api/eleves/all')
  return response.data
}

export async function updateStudent(id: number, data: StudentRequest): Promise<StudentResponse> {
  const response = await api.put(`/api/eleves/${id}`, data)
  return response.data
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/api/eleves/${id}`)
}
