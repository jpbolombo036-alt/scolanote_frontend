export interface AssessmentType {
  id: number
  nom: string
  coefficient: number
  createdAt?: string
  updatedAt?: string
}

export interface AssessmentTypeRequest {
  nom: string
  coefficient: number
}

export interface AssessmentTypeResponse {
  id: number
  nom: string
  coefficient: number
  createdAt?: string
  updatedAt?: string
}
