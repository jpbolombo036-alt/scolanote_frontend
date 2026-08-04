import api from './axios'
import type { UserStudent, UserStudentRequest, UserStudentResponse } from '@/types'

export async function createUserStudent(data: UserStudentRequest): Promise<UserStudentResponse> {
  const response = await api.post('/api/utilisateurs-eleves', data)
  return response.data
}

export async function getAccessibleUserStudents(): Promise<UserStudentResponse[]> {
  const response = await api.get('/api/utilisateurs-eleves')
  return response.data
}

export async function deleteUserStudent(id: number): Promise<void> {
  await api.delete(`/api/utilisateurs-eleves/${id}`)
}