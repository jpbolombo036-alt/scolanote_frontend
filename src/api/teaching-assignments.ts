import api from './axios'
import type { TeachingAssignment, TeachingAssignmentRequest, TeachingAssignmentResponse } from '@/types'

export async function createTeachingAssignment(data: TeachingAssignmentRequest): Promise<TeachingAssignmentResponse> {
  const response = await api.post('/api/attributions-enseignement', data)
  return response.data
}

export async function getTeachingAssignment(id: number): Promise<TeachingAssignmentResponse> {
  const response = await api.get(`/api/attributions-enseignement/${id}`)
  return response.data
}

export async function getAllTeachingAssignments(): Promise<TeachingAssignmentResponse[]> {
  const response = await api.get('/api/attributions-enseignement')
  return response.data
}

export async function getTeachingAssignmentsByClassroom(classroomId: number): Promise<TeachingAssignmentResponse[]> {
  const response = await api.get(`/api/attributions-enseignement/classe/${classroomId}`)
  return response.data
}

export async function updateTeachingAssignment(id: number, data: TeachingAssignmentRequest): Promise<TeachingAssignmentResponse> {
  const response = await api.put(`/api/attributions-enseignement/${id}`, data)
  return response.data
}

export async function deleteTeachingAssignment(id: number): Promise<void> {
  await api.delete(`/api/attributions-enseignement/${id}`)
}
