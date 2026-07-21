export interface Grade {
  id: number
  assessmentId: number
  studentId: number
  note?: number
  absence?: boolean
  observation?: string
  createdAt?: string
  updatedAt?: string
}

export interface GradeRequest {
  assessmentId: number
  studentId: number
  note?: number
  absence?: boolean
  observation?: string
}

export interface GradeResponse {
  id: number
  assessmentId: number
  studentId: number
  studentNom?: string
  studentMatricule?: string
  note?: number
  absence?: boolean
  observation?: string
  createdAt?: string
  updatedAt?: string
}
