export interface Period {
  id: number
  trimesterId: number
  nom: string
  ordre?: number
  type: 'PERIODE' | 'EXAMEN'
  dateDebut?: string
  dateFin?: string
  verrouille: boolean
  dateVerrouillage?: string
  verrouillePar?: string
  createdAt?: string
  updatedAt?: string
}

export interface PeriodRequest {
  trimesterId: number
  nom: string
  ordre?: number
  type?: 'PERIODE' | 'EXAMEN'
  dateDebut?: string
  dateFin?: string
}

export interface PeriodResponse {
  id: number
  trimesterId: number
  trimesterNom?: string
  nom: string
  ordre?: number
  type?: 'PERIODE' | 'EXAMEN'
  dateDebut?: string
  dateFin?: string
  verrouille: boolean
  dateVerrouillage?: string
  verrouillePar?: string
  createdAt?: string
  updatedAt?: string
}

export interface PeriodValidationResponse {
  peutVerrouiller: boolean
  nombreEvaluations: number
  nombreNotes: number
  notesManquantes: number
  message: string
}
