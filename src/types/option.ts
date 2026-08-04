export interface Option {
  id: number
  sectionId: number
  sectionNom?: string
  nom: string
  createdAt?: string
  updatedAt?: string
}

export interface OptionRequest {
  sectionId: number
  nom: string
}

export interface OptionResponse {
  id: number
  sectionId: number
  sectionNom?: string
  nom: string
  createdAt?: string
  updatedAt?: string
}