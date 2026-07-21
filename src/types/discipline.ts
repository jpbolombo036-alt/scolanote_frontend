export interface Discipline {
  id: number
  studentId: number
  periodId: number
  conduite?: string
  application?: string
  observation?: string
  createdAt?: string
  updatedAt?: string
}

export interface DisciplineRequest {
  studentId: number
  periodId: number
  conduite?: string
  application?: string
  observation?: string
}

export interface DisciplineResponse {
  id: number
  studentId: number
  studentNom?: string
  studentMatricule?: string
  periodId: number
  periodNom?: string
  conduite?: string
  application?: string
  observation?: string
  createdAt?: string
  updatedAt?: string
}
