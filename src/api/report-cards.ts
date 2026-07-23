import api from './axios'
import type { ReportCard, ReportCardRequest, ReportCardResponse, PaginatedResponse } from '@/types'

export async function generateBulletins(data: ReportCardRequest): Promise<ReportCardResponse[]> {
  const response = await api.post('/api/bulletins/generer', data)
  return response.data
}

export async function getReportCard(id: number): Promise<ReportCardResponse> {
  const response = await api.get(`/api/bulletins/${id}`)
  return response.data
}

export async function getReportCardsByEnrollment(enrollmentId: number): Promise<ReportCardResponse[]> {
  const response = await api.get(`/api/bulletins/inscription/${enrollmentId}`)
  return response.data
}

export async function getReportCardsByPeriod(periodId: number): Promise<ReportCardResponse[]> {
  const response = await api.get(`/api/bulletins/period/${periodId}`)
  return response.data
}

export async function downloadPdf(id: number): Promise<Blob> {
  const response = await api.post(`/api/bulletins/${id}/pdf`, {}, { responseType: 'blob' })
  return response.data
}
