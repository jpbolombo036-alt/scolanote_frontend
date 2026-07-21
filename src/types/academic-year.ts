export interface AcademicYear {
  id: number
  schoolId: number
  libelle: string
  dateDebut?: string
  dateFin?: string
  active?: boolean
  verrouille?: boolean
  dateVerrouillage?: string
  verrouillePar?: string
  createdAt?: string
  updatedAt?: string
}

export interface AcademicYearRequest {
  schoolId: number
  libelle: string
  dateDebut?: string
  dateFin?: string
  active?: boolean
}

export interface AcademicYearResponse {
  id: number
  schoolId: number
  libelle: string
  dateDebut?: string
  dateFin?: string
  active?: boolean
  verrouille?: boolean
  dateVerrouillage?: string
  verrouillePar?: string
  createdAt?: string
  updatedAt?: string
}
