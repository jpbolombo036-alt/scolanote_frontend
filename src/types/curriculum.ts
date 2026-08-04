export interface Curriculum {
  id: number
  levelId: number
  levelNom?: string
  sectionId: number
  sectionNom?: string
  optionId?: number
  optionNom?: string
  nom: string
  createdAt?: string
  updatedAt?: string
}

export interface CurriculumRequest {
  levelId?: number
  sectionId?: number
  optionId?: number
  nom: string
}

export interface CurriculumResponse {
  id: number
  levelId: number
  levelNom?: string
  sectionId: number
  sectionNom?: string
  optionId?: number
  optionNom?: string
  nom: string
  createdAt?: string
  updatedAt?: string
}