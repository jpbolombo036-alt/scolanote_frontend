export interface Assessment {
  id: number
  assignmentId: number
  assessmentTypeId: number
  periodId: number
  titre: string
  date?: string
  noteMax?: number
  publie?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AssessmentRequest {
  assignmentId: number
  assessmentTypeId: number
  periodId: number
  titre: string
  date?: string
  noteMax?: number
  publie?: boolean
}

export interface AssessmentResponse {
  id: number
  assignmentId: number
  assessmentTypeId: number
  assessmentTypeNom?: string
  periodId: number
  periodNom?: string
  titre: string
  date?: string
  noteMax?: number
  publie?: boolean
  createdAt?: string
  updatedAt?: string
}
