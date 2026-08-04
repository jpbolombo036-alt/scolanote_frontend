export interface Section {
  id: number
  nom: string
  createdAt?: string
  updatedAt?: string
}

export interface SectionRequest {
  nom: string
}

export interface SectionResponse {
  id: number
  nom: string
  createdAt?: string
  updatedAt?: string
}