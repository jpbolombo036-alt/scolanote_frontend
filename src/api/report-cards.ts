import api from './axios'
import type {
  ReportCardRequest,
  ReportCardResponse,
  ReportCardWorkflowResponse,
  ReportCardActionRequest,
  AcademicYearReportCardResponse,
  AcademicYearGenerationRequest,
  AcademicYearReportCardDetailResponse,
  PaginatedResponse,
} from '@/types'

// === Génération et consultation ===

export async function generateBulletins(data: ReportCardRequest): Promise<ReportCardResponse[]> {
  const response = await api.post('/api/bulletins/generer', data)
  return response.data
}

/** Lance la génération asynchrone des bulletins annuels pour une classe et une année scolaire */
export async function generateAcademicYearBulletins(data: AcademicYearGenerationRequest): Promise<{ message: string }> {
  const response = await api.post('/api/bulletins/generer-annuel-async', data)
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

/** Génère le bulletin (si absent) pour une inscription (élève) et une période */
export async function generateBulletinForEnrollment(enrollmentId: number, periodId: number): Promise<ReportCardResponse> {
  const response = await api.post(`/api/bulletins/inscription/${enrollmentId}/generer`, { periodId })
  return response.data
}

/** Bulletins d'un trimestre (le backend expose /trimestre/{trimestreId}) */
export async function getReportCardsByTrimester(trimestreId: number): Promise<ReportCardResponse[]> {
  const response = await api.get(`/api/bulletins/trimestre/${trimestreId}`)
  return response.data
}

/** Liste paginée des bulletins accessibles à l'utilisateur connecté */
export async function getAccessibleReportCards(params?: {
  page?: number
  size?: number
  sort?: string
}): Promise<PaginatedResponse<ReportCardResponse>> {
  const response = await api.get('/api/bulletins', { params })
  return response.data
}

/** Liste complète (non paginée) des bulletins accessibles */
export async function getAllReportCardsUnpaginated(): Promise<ReportCardResponse[]> {
  const response = await api.get('/api/bulletins/unpaginated')
  return response.data
}

/** Bulletins de l'utilisateur connecté (élève ou parent), optionnellement filtrés par trimestre */
export async function getMyReportCards(trimestreId?: number): Promise<ReportCardResponse[]> {
  const params = trimestreId ? { trimestreId } : {}
  const response = await api.get('/api/bulletins/mes-bulletins', { params })
  return response.data
}

/** Génère (si absent) et télécharge le PDF du bulletin */
export async function downloadPdf(id: number): Promise<Blob> {
  const response = await api.post(`/api/bulletins/${id}/pdf`, {}, { responseType: 'blob' })
  return response.data
}

/** Récupère un bulletin annuel par son ID */
export async function getAcademicYearReportCard(id: number): Promise<AcademicYearReportCardResponse> {
  const response = await api.get(`/api/bulletins-annuels/${id}`)
  return response.data
}

/** Liste paginée des bulletins annuels */
export async function getAcademicYearReportCards(params?: {
  page?: number
  size?: number
  sort?: string
}): Promise<PaginatedResponse<AcademicYearReportCardResponse>> {
  const response = await api.get('/api/bulletins-annuels', { params })
  return response.data
}

/** Récupère les bulletins annuels pour une inscription (élève) */
export async function getAcademicYearReportCardsByEnrollment(enrollmentId: number): Promise<AcademicYearReportCardResponse[]> {
  const response = await api.get(`/api/bulletins-annuels/inscription/${enrollmentId}`)
  return response.data
}

/** Télécharge le PDF d'un bulletin annuel */
export async function downloadAcademicYearPdf(id: number): Promise<Blob> {
  const response = await api.post(`/api/bulletins-annuels/${id}/pdf`, {}, { responseType: 'blob' })
  return response.data
}

// === Workflow de validation / signature / publication ===
// Statuts: BROUILLON -> VALIDE_PREFET -> VALIDE_DIRECTEUR -> SIGNE -> PUBLIE

/** Validation par le préfet (BROUILLON -> VALIDE_PREFET) */
export async function validerParPrefet(id: number): Promise<ReportCardWorkflowResponse> {
  const response = await api.post(`/api/bulletins/workflow/${id}/valider-prefet`)
  return response.data
}

/** Validation par le directeur (VALIDE_PREFET -> VALIDE_DIRECTEUR) */
export async function validerParDirecteur(id: number, data?: ReportCardActionRequest): Promise<ReportCardWorkflowResponse> {
  const response = await api.post(`/api/bulletins/workflow/${id}/valider-directeur`, data ?? {})
  return response.data
}

/** Signature électronique du bulletin (VALIDE_DIRECTEUR -> SIGNE) */
export async function signerBulletin(id: number, data?: ReportCardActionRequest): Promise<ReportCardWorkflowResponse> {
  const response = await api.post(`/api/bulletins/workflow/${id}/signer`, data ?? {})
  return response.data
}

/** Publication du bulletin après signature (SIGNE -> PUBLIE) */
export async function publierBulletin(id: number): Promise<ReportCardWorkflowResponse> {
  const response = await api.post(`/api/bulletins/workflow/${id}/publier`)
  return response.data
}
