import api from './axios'
import type { UserTeacher } from '@/types'

export async function getAllUserTeachers(): Promise<UserTeacher[]> {
  const response = await api.get('/api/user-teachers')
  return response.data
}

export async function createUserTeacher(data: { userId: number; teacherId: number }): Promise<UserTeacher> {
  const response = await api.post('/api/user-teachers', data)
  return response.data
}

export async function deleteUserTeacher(id: number): Promise<void> {
  await api.delete(`/api/user-teachers/${id}`)
}
