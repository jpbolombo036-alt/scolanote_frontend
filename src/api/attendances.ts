import api from './axios'
import type { Attendance, AttendanceRequest, AttendanceResponse, PaginatedResponse } from '@/types'

export async function createAttendance(data: AttendanceRequest): Promise<AttendanceResponse> {
  const response = await api.post('/api/presences', data)
  return response.data
}

export async function getAttendance(id: number): Promise<AttendanceResponse> {
  const response = await api.get(`/api/presences/${id}`)
  return response.data
}

export async function getAllAttendances(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<AttendanceResponse>> {
  const response = await api.get('/api/presences', { params })
  return response.data
}

export async function getAttendancesByStudent(studentId: number): Promise<AttendanceResponse[]> {
  const response = await api.get(`/api/presences/student/${studentId}`)
  return response.data
}

export async function updateAttendance(id: number, data: AttendanceRequest): Promise<AttendanceResponse> {
  const response = await api.put(`/api/presences/${id}`, data)
  return response.data
}

export async function deleteAttendance(id: number): Promise<void> {
  await api.delete(`/api/presences/${id}`)
}
