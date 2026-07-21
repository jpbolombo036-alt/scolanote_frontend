export interface Subject {
  id: number
  nom: string
  code: string
  createdAt?: string
  updatedAt?: string
}

export interface SubjectRequest {
  nom: string
  code: string
}

export interface SubjectResponse {
  id: number
  nom: string
  code: string
  createdAt?: string
  updatedAt?: string
}
