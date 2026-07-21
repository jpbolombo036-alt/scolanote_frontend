export interface Trimester {
  id: number
  academicYearId: number
  nom: string
  ordre?: number
  dateDebut?: string
  dateFin?: string
  createdAt?: string
  updatedAt?: string
}

export interface TrimesterRequest {
  academicYearId: number
  nom: string
  ordre?: number
  dateDebut?: string
  dateFin?: string
}

export interface TrimesterResponse {
  id: number
  academicYearId: number
  academicYearLibelle?: string
  nom: string
  ordre?: number
  dateDebut?: string
  dateFin?: string
  createdAt?: string
  updatedAt?: string
}
