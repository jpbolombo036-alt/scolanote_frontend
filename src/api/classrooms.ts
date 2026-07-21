import api from './axios'
import type { Classroom, ClassroomRequest, ClassroomResponse, PaginatedResponse } from '@/types'

export async function createClassroom(data: ClassroomRequest): Promise<ClassroomResponse> {
  const response = await api.post('/api/salles', data)
  return response.data
}

export async function getClassroom(id: number): Promise<ClassroomResponse> {
  const response = await api.get(`/api/salles/${id}`)
  return response.data
}

export async function getAllClassrooms(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<ClassroomResponse>> {
  const response = await api.get('/api/salles', { params })
  return response.data
}

export async function getAllClassroomsUnpaginated(): Promise<ClassroomResponse[]> {
  const response = await api.get('/api/salles/all')
  return response.data
}

export async function getClassroomsByAcademicYear(academicYearId: number): Promise<ClassroomResponse[]> {
  const response = await api.get(`/api/salles/annee-academique/${academicYearId}`)
  return response.data
}

export async function updateClassroom(id: number, data: ClassroomRequest): Promise<ClassroomResponse> {
  const response = await api.put(`/api/salles/${id}`, data)
  return response.data
}

export async function deleteClassroom(id: number): Promise<void> {
  await api.delete(`/api/salles/${id}`)
}
