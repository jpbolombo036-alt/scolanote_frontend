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
  statut?: string
  details?: ReportCardDetail[]
}
