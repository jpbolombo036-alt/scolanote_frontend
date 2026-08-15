import api from './axios'
import type { Grade, GradeRequest, GradeResponse, MissingGradeStudent, PaginatedResponse } from '@/types'

export async function createGrade(data: GradeRequest): Promise<GradeResponse> {
  const response = await api.post('/api/notes', data)
  return response.data
}

export async function getGrade(id: number): Promise<GradeResponse> {
  const response = await api.get('/api/notes/' + id)
  return response.data
}

export async function getAllGrades(params?: { page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<GradeResponse>> {
  const response = await api.get('/api/notes', { params })
  return response.data
}

export async function getAllGradesUnpaginated(): Promise<GradeResponse[]> {
  const response = await api.get('/api/notes/unpaginated')
  return response.data
}

export async function getGradesByAssessment(evaluationId: number): Promise<GradeResponse[]> {
  const response = await api.get('/api/notes/evaluation/' + evaluationId)
  return response.data
}

/**
 * Retourne les eleves de la classe qui n'ont PAS encore de note pour
 * l'evaluation (tries par numero d'ordre). Un eleve deja note - ou marque
 * absent - n'apparait plus dans cette liste.
 */
export async function getStudentsWithoutGrade(evaluationId: number): Promise<MissingGradeStudent[]> {
  const response = await api.get(`/api/notes/evaluation/${evaluationId}/manquants`)
  return response.data
}

export async function getGradesByStudent(eleveId: number): Promise<GradeResponse[]> {
  const response = await api.get('/api/notes/eleve/' + eleveId)
  return response.data
}

export async function updateGrade(id: number, data: GradeRequest): Promise<GradeResponse> {
  const response = await api.put('/api/notes/' + id, data)
  return response.data
}

export async function deleteGrade(id: number): Promise<void> {
  await api.delete('/api/notes/' + id)
}