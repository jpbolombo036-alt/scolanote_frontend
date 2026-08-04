export interface ReportCardDetail {
  id: number
  reportCardId: number
  subjectId?: number
  subjectNom?: string
  subjectCode?: string
  coefficient?: number
  moyenne?: number
  rangMatiere?: number
  points?: number
  maximum?: number
  pourcentage?: number
  observation?: string
}

export interface ReportCard {
  id: number
  enrollmentId: number
  periodId: number
  pourcentage?: number
  totalPoints?: number
  maximumPoints?: number
  rang?: number
  mention?: string
  decision?: string
  totalAbsences?: number
  totalRetards?: number
  conduite?: string
  application?: string
  dateGeneration?: string
  pdfUrl?: string
  statut?: 'BROUILLON' | 'VALIDE_PREFET' | 'VALIDE_DIRECTEUR' | 'SIGNE' | 'PUBLIE'
  details?: ReportCardDetail[]
}

export interface ReportCardRequest {
  classroomId: number
  periodId: number
}

export type ReportCardStatut = 'BROUILLON' | 'VALIDE_PREFET' | 'VALIDE_DIRECTEUR' | 'SIGNE' | 'PUBLIE'

export interface ReportCardResponse {
  id: number
  enrollmentId: number
  studentId?: number
  studentNom?: string
  studentMatricule?: string
  classroomId?: number
  classroomNom?: string
  periodId: number
  periodNom?: string
  trimesterId?: number
  trimesterNom?: string
  academicYearId?: number
  academicYearLibelle?: string
  schoolId?: number
  schoolNom?: string
  pourcentage?: number
  totalPoints?: number
  maximumPoints?: number
  rang?: number
  mention?: string
  decision?: string
  totalAbsences?: number
  totalRetards?: number
  conduite?: string
  application?: string
  dateGeneration?: string
  pdfUrl?: string
  statut?: ReportCardStatut | string
  details?: ReportCardDetail[]
}

// === Workflow de validation/signature des bulletins (backend: ReportCardWorkflowController) ===

export interface ReportCardWorkflowResponse {
  id: number
  statut: ReportCardStatut
  signatureUrl?: string
  valideParPrefetAt?: string
  valideParDirecteurAt?: string
  signeAt?: string
  publieAt?: string
}

export interface ReportCardActionRequest {
  signatureUrl?: string
}
