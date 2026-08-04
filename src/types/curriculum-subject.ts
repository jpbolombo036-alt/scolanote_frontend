export interface CurriculumSubject {
  id: number
  curriculumId: number
  curriculumNom?: string
  subjectId: number
  subjectNom?: string
  subjectCode?: string
  coefficient?: number
  ordre?: number
  obligatoire: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CurriculumSubjectRequest {
  curriculumId: number
  subjectId: number
  coefficient?: number
  ordre?: number
  obligatoire?: boolean
}

export interface CurriculumSubjectResponse {
  id: number
  curriculumId: number
  curriculumNom?: string
  subjectId: number
  subjectNom?: string
  subjectCode?: string
  coefficient?: number
  ordre?: number
  obligatoire: boolean
  createdAt?: string
  updatedAt?: string
}