export interface Classroom {
  id: number
  academicYearId: number
  levelId: number
  sectionId: number
  optionId?: number
  reportTemplateId?: number
  nom: string
  capacite?: number
  titulaireId?: number
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ClassroomRequest {
  academicYearId: number
  levelId: number
  sectionId: number
  optionId?: number
  reportTemplateId?: number
  nom: string
  capacite?: number
  titulaireId?: number
  active?: boolean
}

export interface ClassroomResponse {
  id: number
  academicYearId: number
  levelId: number
  sectionId: number
  optionId?: number
  reportTemplateId?: number
  nom: string
  capacite?: number
  titulaireId?: number
  active?: boolean
  createdAt?: string
  updatedAt?: string
}
