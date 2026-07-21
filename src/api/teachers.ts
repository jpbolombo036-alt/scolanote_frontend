import api from './axios'
import type { Teacher, TeacherRequest, TeacherResponse, PaginatedResponse } from '@/types'

export async function createTeacher(data: TeacherRequest): Promise<TeacherResponse> {
  const response = await api.post('/api/enseignants', data)
  return response.data
}

export async function getTeacher(id: number): Promise<TeacherResponse> {
  const response = await api.get(`/api/enseignants/${id}`)
  return response.data
}

export async function getAllTeachers(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<TeacherResponse>> {
  const response = await api.get('/api/enseignants', { params })
  return response.data
}

export async function getAllTeachersUnpaginated(): Promise<TeacherResponse[]> {
  const response = await api.get('/api/enseignants/all')
  return response.data
}

export async function updateTeacher(id: number, data: TeacherRequest): Promise<TeacherResponse> {
  const response = await api.put(`/api/enseignants/${id}`, data)
  return response.data
}

export async function deleteTeacher(id: number): Promise<void> {
  await api.delete(`/api/enseignants/${id}`)
}
